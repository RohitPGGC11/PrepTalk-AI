import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    enum: ["frontend", "backend","full-stack","dsa","DevOps","AI/ML","mobile","system-design"]
  },

  difficultyTier: {
    type: String,
    required: true,
    enum: ["beginner", "intermediate", "advanced"]
  },

  order: {
    type: Number,
    required: true
  },

  question: {
    type: String,
    required: true
  },

  expectedKeywords: [String],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

questionSchema.index({ domain: 1, order: 1 });

export default mongoose.model.Question || mongoose.model("Question",questionSchema)