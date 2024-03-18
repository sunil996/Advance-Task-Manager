const express=require("express");
const router=express.Router();
const verifyJWT=require("../middlewares/auth.middleware.js")
const {registerUser,loginUser,resendOtp,verifyUser,logoutUser,updateUser,updatePassword}=require("../controllers/user.controller.js")

router.route("/").post(registerUser)
router.route("/resendOtp").get(resendOtp)
router.route("/verify").post(verifyUser)
router.route("/login").post(loginUser)
router.route("/logOut").post(verifyJWT,logoutUser)
router.route("/updatePassword").patch(verifyJWT,updatePassword)
router.route("/updateInfo").patch(verifyJWT,updateUser) 
 
module.exports=router;
        
