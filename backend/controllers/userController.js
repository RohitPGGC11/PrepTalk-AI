// controllers/userController.js
import Question from "../models/Question.js";
import Session from "../models/SessionModel.js"

export const fetchQuestion = async (req, res) => {
  try {
    const { sessionId,order } = req.query;

    // Basic validation
    if (!sessionId|| !order) {
      return res.status(400).json({
        success: false,
        message: "sessionId and order are required"
      });
    }

    const session = await Session.findById(sessionId);
    if(!session){
      return res.status(404).json({
        success:false,
        message:"Session Not found"
      })
    }


    const questionObject = await Question.findOne({
      domain: session.domain,
      difficultyTier: session.difficultyTier,
      order: Number(order),
      isActive: true
    }).select("-__v"); // optional: remove __v

    if (!questionObject) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.status(200).json({
      success: true,
      data:{
        "questionId":questionObject._id,
        "question": questionObject.question
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
