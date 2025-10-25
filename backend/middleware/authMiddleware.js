import jwt from "jsonwebtoken";



export const protectRoute = async (req,res,next)=>{
  try {
      const token = req.cookies.jwt;

      if(!token){
         return res.status(401).json({
      message: "no token provided"
    });
      }

  } catch (error) {
    
  }
}