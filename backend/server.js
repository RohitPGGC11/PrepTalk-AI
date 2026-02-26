import express from 'express'

import routers from './routes/loginRoute.js';
import AIRouter from './routes/AiRoute.js';
import Adminrouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoute.js';

import connectDB from './config/dbConnection.js';
import cookieParser from "cookie-parser";
// import mongoose from 'mongoose';

import cors from "cors";
import 'dotenv/config';

const app =express();
const PORT=4000;


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}));
app.use(cookieParser())
app.use("/api/user-login",routers)
app.use("/api/ollama",AIRouter);
app.use("/api/admin", Adminrouter);
app.use("/api/user",userRouter);


//ConnectDB
connectDB();

app.get("/", (req, res) => {
  res.send("API working");
});
app.listen(PORT,()=>{
  console.log(`server is running at the http://localhost:${PORT}`);
  
})