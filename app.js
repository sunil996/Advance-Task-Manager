const express=require("express");
const errorHandler=require("./middlewares/errorHandler.middleware.js") 

const app=express();
 
//middelware
app.use(express.json());

//routes

const userRouter=require("./routes/user.routes.js")
app.use("/api/v1/user", userRouter) 

app.use(errorHandler)
module.exports=app;
  


