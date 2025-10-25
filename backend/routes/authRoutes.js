import express from "express";
import { login, logout, onboard, signup } from "../controllers.js/authControllers.js";
const authRouter = express.Router()

authRouter.post("/signup",signup)

authRouter.post("/login",login)

authRouter.post("/logout",logout)

authRouter.post("/onboarding",onboard)


export default authRouter