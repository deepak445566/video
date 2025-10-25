import express from "express";
import { login, logout, onboard, signup } from "../controllers.js/authControllers.js";
import { protectRoute } from "../middleware/authMiddleware.js";
const authRouter = express.Router()

authRouter.post("/signup",signup)

authRouter.post("/login",login)

authRouter.post("/logout",logout)

authRouter.post("/onboarding",protectRoute,onboard)


export default authRouter