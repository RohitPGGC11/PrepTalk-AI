import express from 'express'
import 'dotenv/config';

import router from './routes/loginRoute.js';
import AIRouter from './routes/AiRoute.js';
import Adminrouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoute.js';
import SessionRouter from './routes/SessionRoutes.js';

import connectDB from './config/dbConnection.js';
import cookieParser from "cookie-parser";
// import mongoose from 'mongoose';

import cors from "cors";

const app =express();
const PORT=process.env.PORT || 4000;


app.use(express.json());
app.use(cors({
  origin: "https://prep-talk-ai-hazel.vercel.app", // your frontend URL
  credentials: true
}));
app.use(cookieParser())
app.use("/api/user-login",router)
app.use("/api/ollama",AIRouter);
app.use("/api/admin", Adminrouter);
app.use("/api/user",userRouter);
app.use("/api/session",SessionRouter);

//ConnectDB
connectDB();

app.get("/", (req, res) => {
  res.send("API working");
});
app.listen(PORT,()=>{
  console.log(`server is running at the http://localhost:${PORT}`);
  
})