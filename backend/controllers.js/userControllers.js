import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async(req,res)=>{

try {
  const currentUserId = req.user.id;
  const currentUser = req.user;

  const recommendedUsers= await User.find({
    $and:[
      {_id:{$ne:currentUserId}},
      {$id:{$nin:currentUser.friends}},
      {isOnboarded:true}
    ]
  })

res.status(200).json(recommendedUsers)

} catch (error) {
  console.log("Error in getRecommended controllers",error.message);
  res.status(500).json({message:"INternal server error"});

  
}




}




export const getMyFriends = async(req,res)=>{

try {
  const user = await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage");

res.status(200).json(user.friends);

} catch (error) {
   console.log("Error in getMyFriends controllers",error.message);
  res.status(500).json({message:"INternal server error"});

  
}

}


export const sendFriendRequest = async(req,res)=>{
try {
  const myId=req.user.id;
  const {id:recipientId} = req.params

if(myId === recipientId){
  return res.status(400).json({message:"You cant send friend requset to yurself"});
}

const recipient = await User.findById(recipientId)
if(!recipient){
  return res.status(404).json({message:"Recipient not found"})
}

if(recipient.friends.includes(myId)){
  return res.status(400).json({message:"you already frined of this user"})
}
const existingRequest = await FriendRequest.findOne({
  $or:[
    {sender:myId, recipient:recipientId},
    {sender:recipientId,recipient:myId},
  ]
})
if(existingRequest){
  return res.status(400).json({message:"A friend requset alredy between you and this user"})
}

const friendRequest = await FriendRequest.create({
  sender:myId,
  recipient:recipientId,
});
res.status(201).json(friendRequest)



} catch (error) {
   console.log("Error in sendfriend request controllers",error.message);
  res.status(500).json({message:"INternal server error"});

}
}


export const acceptFriendRequest = async(req,res)=>{
try {
  const {id:requestId}= req.params
const friendRequest = await FriendRequest.findById(requestId);
if(!friendRequest){
  return res.status(404).json({message:"Friend request not found"});

}
if(friendRequest.recipient.toString() !== req.user.id){
  return res.status(403).json({message:"you are not authoried this response"});

}

friendRequest.status = "accepted";
await friendRequest.save();


await User.findByIdAndUpdate(friendRequest.sender,{
  $addToSet:{friends:friendRequest.recipient},
});

await User.findByIdAndUpdate(friendRequest.recipient,{
  $addToSet:{friends:friendRequest.sender},
});


res.status(200).json({message:"Friend request accepted"});






} catch (error) {
    console.log("Error in acceptedfrined request controllers",error.message);
  res.status(500).json({message:"INternal server error"});

}

}

export const getFriendRequest = async(req,res)=>{
try {
  const incomingRequest = await FriendRequest.find({
    recipient:req.user.id,
    status:"pending",

  }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

const acceptRequest = await FriendRequest.find({
    sender:req.user.id,
    status:"pending",

  }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");

res.status(200).json({incomingRequest,acceptRequest});


  

} catch (error) {
   console.log("Error in getfriendrequest controllers",error.message);
  res.status(500).json({message:"INternal server error"});

}
}

export const getOutgoingFriendRequest = async(req,res)=>{


  try {
    const outgoingRequest = await FriendRequest.find({
      sender:req.user.id,
      status:"pending",

    }).populate("recipient","fullName profilePic nativeLanguage learningLanguage")



    res.status(200).json({outgoingRequest})
  } catch (error) {
      console.log("Error in getoutgoingfriendrequest controllers",error.message);
  res.status(500).json({message:"INternal server error"});
  }
}