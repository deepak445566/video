import jwt from "jsonwebtoken";
import User from "../models/User.js";



export const protectRoute = async (req,res,next)=>{
  try {
      const token = req.cookies.jwt;

      if(!token){
         return res.status(401).json({
      message: "no token provided"
    });
      }
 const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug
 if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure - ownerId not found"
      });
    }

   const user = await User.findById(decoded.userId).select("-password");

 if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    req.user = user;
    next()



  } catch (error) {
    console.error("❌ protectUser - Auth middleware error:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error in authentication"
    });
  }
}