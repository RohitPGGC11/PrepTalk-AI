import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({

  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true
  },

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  attemtedquestion:{
    type:String,
  },

  userAnswer: {
    type: String,
    required: true
  },

  /* ─── AI SCORING METRICS ─── */
  accuracy: Number,
  depth: Number,
  clarity: Number,
  problemSolving: Number,
  exampleUsage: Number,
  communicationStructure: Number,
  grammar: Number,

  overallScore: Number,

  feedback: String

}, { timestamps: true });

export default mongoose.model("Answer", answerSchema);