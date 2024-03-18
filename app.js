const express=require("express");
const errorHandler=require("./middlewares/errorHandler.middleware.js") 
const cron = require('node-cron');
const app=express();
 
 
app.use(express.json());

//routes 
const userRouter=require("./routes/user.routes.js")
const collectionRouter=require("./routes/collection.routes.js");
const taskRouter=require("./routes/task.routes.js");

app.use("/api/v1/user", userRouter) 
app.use("/api/v1/collection",collectionRouter);
app.use("/api/v1/task",taskRouter);
 
cron.schedule('0 0 * * 1-5', async () => {
    
    try {  
    //  await removeUnverifiedUsers();
    } catch (error) {
        console.error('Error in cleanup job:', error.message);
    }
  });

 
app.use(errorHandler)
module.exports=app;  