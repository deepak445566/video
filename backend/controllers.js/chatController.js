import { generatesStreamToken } from "../config/stream.js"


export const getStreamToken = async(req,res)=>{
  try {
    const token = generatesStreamToken(req.user.id);
    res.status(200).json({token})
  } catch (error) {
    console.log("error in getstreamtoken");
    res.status(500).json({message:"internal server error"});

  }
}