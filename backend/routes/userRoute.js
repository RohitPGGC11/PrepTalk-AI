import express from "express";
import { fetchQuestion ,getAnswerBySessions} from "../controllers/userController.js";
const userRouter = express.Router();


userRouter.get("/get-question",fetchQuestion);
userRouter.post("/answerBy-Id",getAnswerBySessions)


export default userRouter;