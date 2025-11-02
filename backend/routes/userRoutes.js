import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendRequest, getRecommendedUsers, sendFriendRequest } from "../controllers.js/userControllers.js";

const userRouter = express.Router()

userRouter.get("/",protectRoute,getRecommendedUsers)
userRouter.get("/friends",protectRoute,getMyFriends)


userRouter.post("/friend-request/:id",protectRoute,sendFriendRequest)
userRouter.put("/friend-request/:id/accept",protectRoute,acceptFriendRequest)
userRouter.get("/friend-request",protectRoute,getFriendRequest)


userRouter.get("/outgoing-friend",protectRoute,getOutgoingFriendRequest)


export default userRouter