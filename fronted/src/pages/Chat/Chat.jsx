import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api.js";
import "./Chat.css";
import { createSpeechRecognition } from "../../utils/speechRecognition.js";
import { FaMicrophone } from "react-icons/fa";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";




function SpeechToText() {

  const [text, setText] = useState("");
  const [message, setmessage] = useState([])
  
  const [loading, setLoading] = useState(false);
  const [question, setquestion] = useState(null);
  const [currentOrder, setcurrentOrder] = useState(1);

  const [questionId, setquestionId] = useState(null)
  const {sessionId} = useParams()
  
  const recognitionRef = useRef(null);
  const [listening, setlistening] = useState(false);

  const navigate = useNavigate();
 
  useEffect(() => {
    fetchQuestion();
  }, [currentOrder]);

  
     const EndSession = async () =>{
    try {
      const response = await api.put(`/api/session/${sessionId}/end`);
            if(response.data.success){
              toast.success(response.data.message);
              navigate("/dashboard")
            }else{
              toast.error(response.data.message);
            }
    } catch (error) {
      console.log(error);
    }
  }


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
        if (!questionData || !questionData.question) {
          if(currentOrder === 1){
            setmessage([{
              sender:"ai",
              text:"No questions available for the selected domain right now. Please try a different domain or check back later."
            }])
          }else{
              toast.info("Interview completed");
              EndSession();
          }
              return;
            }

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
    setlistening(true);
  };

  // Stop Listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setlistening(false);
    }
  };

  const toggleMic = () =>{
    if(listening){
      stopListening();
    }else{
      startListening();
    }
  }

  // Send text to backend
  const submitAnswer = async () => {
    stopListening();
    if (!text.trim()) {
      toast.warning("Please Speak Somthing First !")
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
        setTimeout(()=>{
            setcurrentOrder((prev) => prev + 1);
        },2000);
        
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
      <h2 className="speech-title">AI Interview Assistant</h2>

      <div className="question-answer-group">
        <div className="chat-box">
          {message.map((msg,index)=>(
            <div key={index} className={msg.sender ==="user" ? "chat-message user-message" : "chat-message ai-message"}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
        <div className="output-box">
            <textarea
              className="input-text"
              placeholder="Speak your answer or Type it here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key==="Enter" && !e.shiftKey){
                  e.preventDefault();
                  submitAnswer();
                }
              }}
            ></textarea>
        </div>
      </div>

      <div className="button-group">

          <button className={`mic-btn ${listening ? "recording" : ""}`} onClick={toggleMic}>
          <FaMicrophone/>
          </button> 

          <button className="btn response-btn" 
          onClick={submitAnswer}
          disabled={loading}
          >
              {loading ? "Thinking..." : "Get Response"}
          </button>
          
          <button className="btn dashboard-btn"
          onClick={ EndSession }
          >
           Go to dashboard
          </button>
      </div>
       
    </div>
  );
}

export default SpeechToText;
