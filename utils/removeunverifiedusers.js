const cron = require('node-cron');
const User=require("../models/User");

async function removeUnverifiedUsers() {

    try {
  
      let page = 1;
      let pageSize = 5;  
   
      while (true) {
  
        const users = await User.find()
          .sort({ createdAt: 1 })  
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .select(" isVerified createdAt")
         
        if (users.length === 0) {
          break;  
        }
  
        for (const user of users) {
   
         let yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);

         await User.deleteOne({isVeried:false,createdAt:{$lt:yesterday}})
        }
  
        page++;
      }
    } catch (error) {
      throw error;
    }
  }

  module.exports=removeUnverifiedUsers;