import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  domain:{
    type:String,
    required:true
  },
  difficultyTier:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default:"active"
  },
  totalQuestions:{
    type:Number,
    default:0
  },
  avgScore:{
    type:Number,
    default:0
  }
 

},{timestamps:true})

export default mongoose.model("Session",sessionSchema);
