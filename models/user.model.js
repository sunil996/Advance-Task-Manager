const mongoose = require("mongoose");
const { Schema } = require("mongoose"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator');

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [3, 'Full name must be at least 3 characters'],
            maxlength: [50, 'Full name cannot exceed 50 characters'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: [true, 'Phone number must be unique'],
            trim: true,
            match: [/^[0-9]{10}$/, 'Invalid phone number format'], 
        }, 
         

        otp: {
            value: Number,
            expiresAt: Date,
            attempts: {
                count: { type: Number, default: 0 },
                resetAt: Date,
                resendCount: { type: Number, default: 0 },
                nextResend: Date
            },
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
       
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//genrate otp 
userSchema.methods.generateOTP = async function generateOtp() {

    const resendLimit = 2;
    const waitingTimeInHours = 2;
    const otpValidityMinutes = 5;
  
    if (this.otp.attempts.resendCount > resendLimit) {
      const waitingTime = waitingTimeInHours * 60 * 60 * 1000;
      
      this.otp.value = null;
      this.otp.expiresAt = null;
      this.otp.attempts.resendCount = 0;
      this.otp.attempts.nextResend = new Date(Date.now() + waitingTime);
  
      try {
        await this.save({ new: true });
      } catch (error) {
        throw new Error("Failed to set nextResend!");
      }

    }

  
    if (this.otp.attempts.nextResend !== null && this.otp.attempts.nextResend > Date.now()) {
      const remainingTimeInMinutes = Math.ceil((this.otp.attempts.nextResend - Date.now()) / (1000 * 60));
      throw new Error(`You exceeded the OTP generation limit. Try again after ${remainingTimeInMinutes} minutes.`);
    }
  
    const otpValue = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false });
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + otpValidityMinutes);
  
    const resendCountPreviousData = this.otp.attempts.resendCount + 1;
  
    this.otp.value = otpValue;
    this.otp.expiresAt = otpExpiration;
    this.otp.attempts.count = 0;
    this.otp.attempts.resetAt = null;
    this.otp.attempts.resendCount = resendCountPreviousData;
    this.otp.attempts.count = null;
  
    try {
       await this.save({ new: true });
       return otpValue;
    } catch (error) {
      throw new Error("Failed to generate an OTP!");
    }
  };
    
  
//verify otp
userSchema.methods.verifyOTP =async function (enteredOtp) {
    
    try {
            if(this.otp.attempts.count>3){
      
            this.otp.attempts.count=0;
            this.otp.attempts.resetAt=new Date(Date.now() + 2*60*60*1000);
         
            await this.save();
            return false;
          } 
          if(!enteredOtp || enteredOtp !=this.otp.value || this.otp.expiresAt<Date.now() || this.otp.attempts.resetAt>Date.now()){
           
            this.otp.attempts.count+=1;
            await this.save();
            return false;
          }
         
          this.otp.value=null;
         this.otp.expiresAt=null;
         this.otp.attempts.count=0;
         this.otp.attempts.resetAt=null;
         this.otp.attempts.resendCount=null;
         this.otp.attempts.nextResend=null;
         
         await this.save();
         return true;
          
    } catch (error) {
       throw new Error("failed to verify user otp !") 
    }
   };
  
 const User = mongoose.model("User", userSchema);
 module.exports=User

