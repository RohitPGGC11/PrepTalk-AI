import { success } from "zod";
import Session from "../models/SessionModel.js"

/* =========================
   1️⃣ CREATE SESSION
========================= */
export const createSession = async (req, res) => {
  try {
    const { domain, difficultyTier } = req.body;

    if (!domain || !difficultyTier) {
      return res.status(400).json({
        success: false,
        message: "Domain and difficultyTier are required"
      });
    }

    const newSession = await Session.create({
      userId: req.user.id, // from auth middleware
      domain,
      difficultyTier
    });

    res.status(201).json({
      success: true,
      sessionId: newSession._id,
      data: newSession
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create session"
    });
  }
};


/* =========================
   2️⃣ GET SINGLE SESSION
========================= */
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id   // security check
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      data: session
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching session"
    });
  }
};


/* =========================
   3️⃣ END SESSION
========================= */
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({
      _id: sessionId,
      userId: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    session.status = "completed";
    session.completedAt = new Date();

    await session.save();

    res.json({
      success: true,
      message: "Session completed",
      data: session
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to end session"
    });
  }
};


/* =========================
   4️⃣ GET ALL USER SESSIONS
========================= */
export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions"
    });
  }
};
