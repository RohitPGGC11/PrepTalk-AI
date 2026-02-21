// controllers/userController.js
import Question from "../models/Question.js";

export const fetchQuestion = async (req, res) => {
  try {
    const { domain, level, order } = req.query;

    // Basic validation
    if (!domain || !level || !order) {
      return res.status(400).json({
        success: false,
        message: "Domain, level and order are required"
      });
    }

    const question = await Question.findOne({
      domain: domain,
      difficultyTier: level,
      order: Number(order),
      isActive: true
    }).select("-__v"); // optional: remove __v

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.status(200).json({
      success: true,
      data: question.question
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
