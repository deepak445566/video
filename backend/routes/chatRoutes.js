import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getStreamToken } from "../controllers.js/chatController.js";

const chatRouter = express.Router()


chatRouter.get("/token",protectRoute,getStreamToken)

export default chatRouter