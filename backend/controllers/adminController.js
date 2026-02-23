import Question from "../models/Question.js"

export const addQuestion = async (req, res) => {
  try {
    const { domain, difficultyTier, order, question, expectedKeywords } = req.body;

    if (!domain || !difficultyTier || !question) {
      return res.status(400).json({
        success: false,
        message: "Domain, difficultyTier and question are required"
      });
    }
    // Count existing questions for this specific domain + difficulty
    const totalQuestions = await Question.countDocuments({
      domain,
      difficultyTier
    });

    let orderNumber;

    // If order not provided → add at end
    if (!order) {
      orderNumber = totalQuestions + 1;
    } else {
      orderNumber = Number(order);

      if (orderNumber < 1) {
        return res.status(400).json({
          success: false,
          message: "Order must be greater than 0"
        });
      }

      // If order is greater than total+1 → set to end
      if (orderNumber > totalQuestions + 1) {
        orderNumber = totalQuestions + 1;
      }

      // Shift only inside same domain + difficulty
      await Question.updateMany(
        {
          domain,
          difficultyTier,
          order: { $gte: orderNumber }
        },
        { $inc: { order: 1 } }
      );
    }

    const newQuestion = await Question.create({
      domain,
      difficultyTier,
      order: orderNumber,
      question,
      expectedKeywords
    });

    res.status(201).json({
      success: true,
      message: `${domain} - ${difficultyTier} question added at order ${orderNumber}`,
      data: newQuestion
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { order, ...rest } = req.body;

    const existing = await Question.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    const oldOrder = existing.order;
    const newOrder = Number(order);

    if (order !== undefined && newOrder !== oldOrder) {

      // Moving UP (5 → 2)
      if (newOrder < oldOrder) {
        await Question.updateMany(
          {
            domain: existing.domain,
            difficultyTier: existing.difficultyTier,
            order: { $gte: newOrder, $lt: oldOrder }
          },
          { $inc: { order: 1 } }
        );
      }

      // Moving DOWN (2 → 5)
      if (newOrder > oldOrder) {
        await Question.updateMany(
          {
            domain: existing.domain,
            difficultyTier: existing.difficultyTier,
            order: { $gt: oldOrder, $lte: newOrder }
          },
          { $inc: { order: -1 } }
        );
      }

      existing.order = newOrder;
    }

    Object.assign(existing, rest);
    await existing.save();

    res.json({
      success: true,
      message: "Question updated successfully",
      data: existing
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Question.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    const { domain, difficultyTier, order } = existing;

    // Permanently remove document
    await Question.findByIdAndDelete(id);

    // Reorder remaining questions
    await Question.updateMany(
      {
        domain,
        difficultyTier,
        order: { $gt: order }
      },
      { $inc: { order: -1 } }
    );

    res.json({
      success: true,
      message: "Question permanently deleted and reordered"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getQuestions = async (req, res) => {
  try {
    const { domain, difficultyTier } = req.query;

    let filter = { isActive: true };

    // Filter by domain
    if (domain && domain !== "All") {
      filter.domain = domain;
    }

    // Filter by difficulty
    if (difficultyTier && difficultyTier !== "All") {
      filter.difficultyTier = difficultyTier;
    }

    const questions = await Question.find(filter)
      .sort({ domain: 1, difficultyTier: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const fetchOne = async (req,res) =>{
  try{
    const { id } = req.params;
    if(!id){
      return res.status(400).
      json({success:false,message:"ID is Required"})
    }
    const question = await Question.findById(id);
    if(!question){
      return res.status(404).json({
      success:false,
      data: question
    });
    }
    res.status(200).json({
      success:true,
      data:question
    })
  }catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}