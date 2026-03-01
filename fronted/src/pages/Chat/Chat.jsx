import { useState, useRef, useEffect,useContext } from "react";

import { useParams } from "react-router-dom";

import api from "../../utils/api.js";
import "./Chat.css";
import { createSpeechRecognition } from "../../utils/speechRecognition.js";


function SpeechToText() {

  const [text, setText] = useState("");
  const [message, setmessage] = useState([])
  
  const [loading, setLoading] = useState(false);
  const [question, setquestion] = useState(null);
  const [currentOrder, setcurrentOrder] = useState(1);

  const [questionId, setquestionId] = useState(null)
  const {sessionId} = useParams()
  
  const recognitionRef = useRef(null);

 
  useEffect(() => {
    fetchQuestion();
  }, [currentOrder]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/api/user/get-question`, {
        params: {
          sessionId:sessionId,
          order: currentOrder,
        }
      });

      if (response.data.success) {

        const questionData =response.data.data;
        const newQuestion=questionData.question;
        
        const newQuestionId=questionData.questionId;
        setquestionId(newQuestionId);
        setquestion(newQuestion);

        setmessage(prev=>[
          ...prev,
          {sender:"ai",text:newQuestion}
        ])
        
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log("Server error");
      }
    }
  };

  //  Start Listening
  const startListening = () => {
    const recognition = createSpeechRecognition(
      (transcript) => setText(transcript),
      (error) => console.error("Speech Error:", error),
    );

    if (!recognition) return;

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Stop Listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Send text to backend
  const submitAnswer = async () => {
    if (!text.trim()) {
      alert("Please speak something first!");
      return;

    }

    try {
      setLoading(true);
      const response = await api.post("/api/ollama/chat", {
      question: question,
      userAnswer: text,
      questionId:questionId,
      sessionId:sessionId,
      });

      if (response.data.success) {

        const airesponse = response.data.data;
        setmessage(prev=>[
          ...prev,
          {sender:"user" , text:text},
          {sender:"Ai" , text:airesponse}
        ])

        // Move to next question
        setcurrentOrder((prev) => prev + 1);
        setText("");
      } else {
        console.log("Backend error");
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //auto scroll
  const chatEndRef = useRef(null);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [message]);

  return (
    <div className="speech-container">
      <h2 className="speech-title">🎤 Speech To Text</h2>

      <div className="question-answer-group">
        <div className="chat-box" ref={chatEndRef}>
          {message.map((msg,index)=>(
            <div key={index} className={msg.sender ==="user" ? "chat-message user-message" : "chat-message ai-message"}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="output-box">
            <textarea
              className="input-text"
              placeholder="Speak your answer or Type it here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
        </div>
      </div>

      <div className="button-group">
        <button className="btn start-btn" onClick={startListening}>
            Start
          </button>
        <button className="btn stop-btn" onClick={stopListening}>
            Stop
          </button>
        <button className="btn response-btn" onClick={submitAnswer}>
            {loading ? "Thinking..." : "Get Response"}
          </button>
      </div>
       
    </div>
  );
}

export default SpeechToText;
