import express from "express";
import { fetchQuestion } from "../controllers/userController.js";
const userRouter = express.Router();


userRouter.get("/get-question",fetchQuestion);

export default userRouter;