import ollama from "ollama";
import Answer from "../models/AnswerAttemptModel.js";
import Session from "../models/SessionModel.js";
export const chatController = async (req, res) => {
  const { question, userAnswer ,questionId,sessionId} = req.body;

  if (!question || !userAnswer) {
    return res.status(400).json({
      success: false,
      error: "question and userAnswer are required"
    });
  }
      
  try {
    const response = await ollama.chat({
      model: "llama3:8b",
      format: "json",
      options: {
        temperature: 0.2,     // Stable scoring
        top_p: 0.9,
        num_predict: 500
      },
      messages: [
        {
          role: "system",
          content: `
You are a strict senior technical interviewer.

Evaluate the user's answer based on the following criteria:

1. Accuracy (technical correctness)
2. Depth (conceptual understanding and explanation depth)
3. Clarity (easy to understand, well explained)
4. ProblemSolving (logical reasoning and approach, if applicable)
5. ExampleUsage (use of relevant examples or real-world application)
6. CommunicationStructure (organized flow: intro → explanation → example → conclusion)
7. Grammar (grammar, sentence structure, professional communication quality)

Scoring Guidelines:
- 0–3: Very weak / incorrect / unclear
- 4–6: Partially correct but missing depth or clarity
- 7–8: Good answer with minor gaps
- 9–10: Excellent, complete, structured, and professional

Important Rules:
- If question is conceptual, ProblemSolving may be low.
- If no examples are given, reduce ExampleUsage score.
- If answer is disorganized, reduce CommunicationStructure score.
- If grammar is poor, reduce Grammar score.
- Be strict and realistic like a real interviewer.

Return ONLY valid JSON in this format:

{
  "accuracy": number,
  "depth": number,
  "clarity": number,
  "problemSolving": number,
  "exampleUsage": number,
  "communicationStructure": number,
  "grammar": number,
  "feedback": "Short constructive feedback explaining strengths and improvements"
}

Do not include any extra text outside JSON.
`
        },
        {
          role: "user",
          content: `
Question:
${question}

User Answer:
${userAnswer}
`
        }
      ]
    });

    const parsed = JSON.parse(response.message.content);
    const rspData=parsed;

    //calculating the overall score
    const overall =(rspData.accuracy +rspData.depth +rspData.clarity +rspData.problemSolving +
                    rspData.exampleUsage +rspData.communicationStructure +rspData.grammar) / 7;

    try {
      const NewAnswer = new Answer({
      sessionId:sessionId,
      questionId:questionId,
      attemtedquestion:question,
      userAnswer:userAnswer,
      accuracy:rspData.accuracy,
      depth:rspData.depth,
      clarity:rspData.clarity,
      problemSolving:rspData.problemSolving,
      exampleUsage:rspData.exampleUsage,
      communicationStructure:rspData.communicationStructure,
      grammar:rspData.grammar,
      overallScore:overall,
      feedback:rspData.feedback
      })
      await NewAnswer.save();
    } catch (error) {
      console.log(error);
    }

    //updating the total Question AND avgScore in that session
    const session = await Session.findById(sessionId);
              if (!session) {
          return res.status(404).json({
            success: false,
            error: "Session not found"
          });
        }
      const newTotal = session.totalQuestions + 1;
      const newAvg =
        ((session.avgScore * session.totalQuestions) + overall) / newTotal;

      session.totalQuestions = newTotal;
      session.avgScore = newAvg;
      await session.save();
      
//returning the AI response feedback to the user
    return res.status(200).json({
      success: true,
      data: parsed.feedback
    });

  } catch (error) {
    console.error("Ollama Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};