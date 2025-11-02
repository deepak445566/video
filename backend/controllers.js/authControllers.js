import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../config/stream.js";

const generateToken = (userId) => {
  const payload = { userId }; // payload must be an object
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic: randomAvatar,
    });

try {
  await upsertStreamUser({
  id:newUser._id.toString(),
  name:newUser.fullName,
  image:newUser.profilePic || ""
});
console.log(`Stream user created for ${newUser.fullName}`);
} catch (error) {
  console.log("Error creating stream user", error)
}



    // ✅ Fixed line
    const token = generateToken(newUser._id);

    res.cookie("jwt", token, {
      httpOnly: true, // JavaScript se access nahi hoga
      secure: process.env.NODE_ENV === "production", // sirf HTTPS par chalega
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User Registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
const token = generateToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true, // JavaScript se access nahi hoga
      secure: process.env.NODE_ENV === "production", // sirf HTTPS par chalega
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      message: "User login successfully",
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "User Logged out successfully",
  });
};


export const onboard = async(req,res)=>{
  try {
    const userId = req.user._id;
    const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body

if(!fullName||!bio|| !nativeLanguage|| !learningLanguage || !location){
  return res.status(400).json({message:"All fields are required",
    missingField:[
      !fullName&& "fullName" ,
      !bio && "bio",
      !nativeLanguage&& "nativeLanguage",
      !learningLanguage && "learningLanguage",
      !location && "location"
    ].filter(Boolean),
  })
}

const updatedUser = await User.findByIdAndUpdate(userId,{ 
  ...req.body,
  isOnboarded:true,
},{new:true})

if(!updatedUser) return res.status(404).json({message:"User not Found"});

try {
  await upsertStreamUser({
    id:updatedUser._id.toString(),
    name:updatedUser.fullName,
    image:updatedUser.profilePic || "",
  })
} catch (streamError) {
  console.log("Error updateing STream user during onBoardings",streamError.message)
}

res.status(200).json({success:true, user:updatedUser});


  } catch (error) {
    console.error("Onboarding error",error);
    res.status(500).json({
      message:"Internal Server Error"
    });
  }
}