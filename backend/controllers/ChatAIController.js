import ollama from "ollama";

export const chatController = async (req, res) => {
  const { question, userAnswer } = req.body;

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
        temperature: 0.2,
        top_p: 0.9,
        num_predict: 400
      },
      messages: [
        {
          role: "system",
          content: `
You are a strict technical interviewer.

Evaluate the user's answer based on:
1. Technical correctness
2. Conceptual depth
3. Clarity of explanation
4. Problem-solving quality (if applicable)

Scoring rules:
- 0-3: Incorrect or very weak answer
- 4-6: Partially correct but missing important details
- 7-8: Good answer with minor gaps
- 9-10: Excellent, complete, and well-structured answer

If the answer is vague, incomplete, or incorrect, reduce the score significantly.

Return ONLY valid JSON in this format:

{
  "accuracy": number (0-10),
  "depth": number (0-10),
  "clarity": number (0-10),
  "problemSolving": number (0-10),
  "feedback": "short constructive feedback"
}

Do not include any extra text.
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

    return res.status(200).json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// import ollama from "ollama";

// export const chatController = async (req, res) => {
//   const { question, expectedAnswer, userAnswer } = req.body;

//   if (!question || !userAnswer) {
//     return res.status(400).json({ error: "question and userAnswer are required" });
//   }

//   try {
//     const response = await ollama.chat({
//       model: "llama3:8b",
//       format: "json", // 🔥 Force JSON output
//       options: {
//         temperature: 0.2,   // 🔥 Stable scoring
//         top_p: 0.9,
//         num_predict: 400
//       },
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a strict technical interviewer.

// Evaluate answers objectively.

// Return ONLY valid JSON in this format:

// {
//   "accuracy": number (0-10),
//   "depth": number (0-10),
//   "clarity": number (0-10),
//   "problemSolving": number (0-10),
//   "feedback": "short constructive feedback"
// }

// Be strict. Do not add extra text.
// `
//         },
//         {
//           role: "user",
//           content: `
// Question:
// ${question}

// Expected Answer:
// ${expectedAnswer || "Not Provided"}

// User Answer:
// ${userAnswer}
// `
//         }
//       ]
//     });

//     // Since format: "json" is enabled,
//     // Ollama already returns valid JSON string
//     const parsed = JSON.parse(response.message.content);

//     return res.status(200).json({
//       success: true,
//       data: parsed
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };