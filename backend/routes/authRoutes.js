import express from "express";
import { login, logout, onboard, signup } from "../controllers.js/authControllers.js";
import { protectRoute } from "../middleware/authMiddleware.js";
const authRouter = express.Router()

authRouter.post("/signup",signup)

authRouter.post("/login",login)

authRouter.post("/logout",logout)

authRouter.post("/onboarding",protectRoute,onboard)


authRouter.get("/me",protectRoute,(req,res)=>{
  res.status(200).json({success:true, user:req.user});
})

export default authRouter