import express from "express"
import dotenv from "dotenv"



import authRouter from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app =express()
await connectDB();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT
app.use("/api/auth",authRouter);


app.listen(PORT,()=>{
  console.log(`server run in port ${PORT}`)
})