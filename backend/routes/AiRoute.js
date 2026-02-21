import express from 'express'
import { chatController } from '../controllers/ChatAIController.js';

const AIRouter = express.Router();

AIRouter.post("/chat",chatController)

export default AIRouter;