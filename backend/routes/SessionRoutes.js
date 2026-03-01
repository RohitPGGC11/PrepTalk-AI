import express from "express";

import {createSession,getSessionById,endSession,getUserSessions} from "../controllers/SessionController.js"

import { verifyAccessToken } from "../middleware/authMiddleware.js";

const SessionRouter = express.Router();

/* CREATE SESSION */
SessionRouter.post("/create", verifyAccessToken, createSession);

/* GET ALL USER SESSIONS */
SessionRouter.get("/my-sessions", verifyAccessToken, getUserSessions);

/* GET SINGLE SESSION */
SessionRouter.get("/:sessionId", verifyAccessToken, getSessionById);


/* END SESSION */
SessionRouter.put("/:sessionId/end", verifyAccessToken, endSession);

export default SessionRouter;