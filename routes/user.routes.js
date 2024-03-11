const express=require("express");
const router=express.Router();
const verifyJWT=require("../middleware/auth.middleware.js")
const {registerUser,resendOtp,verifyUser,loginUser,logoutUser,updateUserPassword,updateUser}=require("../controllers/user.controller.js")

router.route("/").post(registerUser)
router.route("/resendOtp").get(resendOtp)
router.route("/verify").post(verifyUser)
router.route("/login").post(loginUser)
router.route("/logOut").post(verifyJWT,logoutUser)
router.route("/updatePassword").patch(verifyJWT,updateUserPassword)
router.route("/updateInfo").patch(verifyJWT,updateUser) 
 
module.exports=router;
        
