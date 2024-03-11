const verifyJWT=require("../middleware/auth.middleware.js") 
const User = require('../models/user.model.js');
const asyncHandler=require("../utils/asyncWrapper.js")
const twilio = require('twilio');
const phoneRegex = /^[0-9]{10}$/;

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const  registerUser = asyncHandler(async (req, res) => {
    
    const { fullName, password, phoneNumber } = req.body;
     
    if (!fullName || fullName.trim().length < 3 || fullName.length > 50) {
        return res.status(400).json({ success: false, message: 'Full name must be between 3 and 50 characters', data: null });
      }

      if (!password || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters', data: null });
      }
      
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number format', data: null });
      }
    
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with the same phone number already exists', data: null });
      }
 
    const newUser = new User({ fullName, password, phoneNumber });
    await newUser.save();
 
    const otpValue =await  newUser.generateOTP();
    const formattedPhoneNumber = `+91${phoneNumber}`;

    await client.messages.create({

          body: `Your verification OTP for our Task Manager app is  is: ${otpValue}`,
          from: process.env.TWILIO_PHONE_NO,
          to: formattedPhoneNumber,
     });

    return  res.status(201).json({success:true, message: 'User registered successfully', userId: newUser._id });
        
})
 
const  resendOtp = asyncHandler(async (req, res) => {
    
    const userId=req.body.id;

     if(!userId){
       return res.status(400).json({success:false,messae:"provide id",data:null})
     }

    const existingUser = await User.findOne({ _id:userId });
  
    const otpValue =await  existingUser.generateOTP();
    
    
    await client.messages.create({

        body: `Your verification OTP for our Task Manager app is  is: ${otpValue}`,
        from: process.env.TWILIO_PHONE_NO,
        to: formattedPhoneNumber,
   });

   return  res.status(201).json({ message: 'otp resended again  to your phone number successfully', data:otpValue  });

})
 
 const verifyUser = asyncHandler(async (req, res) => {
    
    const { userId, otp } = req.body;
    
    if(!userId){
        return res.status(400).json({success:false,messae:"user id is missing !",data:null})
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({success:false,message:'User not found' ,data:null});
    }
   
    const isOTPVerified = user.verifyOTP(otp);

    if (!isOTPVerified) {
        return res.status(401).json({
            success: false,
            message: 'Invalid OTP or exceeded attempts. Please check your OTP and try again. If the issue persists, consider requesting a new OTP.',
            data: null
        });
    }
   
    user.isVerified = true;
    await user.save();
    
    const userToken=user.generateAccessToken();
    res.status(200).json({ success:true,message: 'User verified successfully',data: userToken});
})

//Login user 
const loginUser=asyncHandler(async(req,res)=>{
    
    const {phoneNumber,password} = req.body;
   
    if (!phoneNumber?.trim() || !phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number format', data: null });
    }

   if (!password || password.length < 8) {
     return res.status(400).json({ success: false, message: 'Password must be at least 8 characters', data: null });
    }
  
   const user = await User.findOne({phoneNumber:phoneNumber?.trim() })

    if (!user) { 
        return res.status(404).json({success:false,message:"User does not find !",data:null})
    }
  
  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    return res.status(401).json({success:false,message:"Invalid user credentials !",data:null})
   }

   const accessToken=await user.generateAccessToken();
   user.password=undefined;
   user.createdAt=undefined;
   user.updatedAt=undefined;

  return res.status(201).json({success:true,message:"successfull login",data:accessToken})
})

//Logout User
const logoutUser = asyncHandler(async(req, res) => {

    return res.status(200).json({success:true,message:"user log out successfully.",data:null})
 });

//update user data.
const updateUser=asyncHandler(async(req,res)=>{

    const { newPhoneNumber, currentPassword, newPassword, newFullName } = req.body;
    const user = req.user;
    
    if (newPhoneNumber) {

        if (!phoneRegex.test(newPhoneNumber)) {
            return res.status(400).json({ success: false, message: 'Invalid phone number format', data: null });
        }

        user.phoneNumber = newPhoneNumber.trim();
    }

    if (newFullName) {
        if (newFullName.length < 3 || newFullName.length > 50) {
            return res.status(400).json({ success: false, message: 'New full name must be between 3 and 50 characters', data: null });
        }

        user.fullName = newFullName?.trim();
    }
    const updatedUser = await user.save();

    const responseData = {
        fullName: updatedUser.fullName,
        phoneNumber: updatedUser.phoneNumber,
        isVerified: updatedUser.isVerified,
    };
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: responseData });
})


//update password 
 
const updatePassword = asyncHandler(async (req, res) => {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword?.trim() || !newPassword?.trim()) {
        return res.status(400).json({ success: false, message: 'Both current and new passwords are required', data: null });
    }

    if (!isCurrentPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid current password', data: null });
    }

    const isCurrentPasswordValid = await req.user.isPasswordCorrect(currentPassword?.trim());
 
    if(!isCurrentPasswordValid){
        return res.status(400).json({ success: false, message: 'invalid user password !', data: null });
    }
    
      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long', data: null });
    }
    req.user.password=newPassword?.trim();
    await req.user.save({validateBeforeSave:false});

   return res.status(200).json({ success: true, message: 'Password updated successfully', data: null });
});

module.exports={registerUser,resendOtp,verifyUser,loginUser,logoutUser,updateUserPassword,updateUser}