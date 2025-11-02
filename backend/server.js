import express from "express"
import dotenv from "dotenv"



import authRouter from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

dotenv.config();

const app =express()
await connectDB();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT

app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/chat",chatRouter)





app.listen(PORT,()=>{
  console.log(`server running in  port ${PORT}`)
})