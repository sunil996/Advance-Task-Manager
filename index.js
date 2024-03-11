require('dotenv').config();
const app =require("./app.js"); 
const connectDB=require("./db/connection.js");

connectDB()
.then(()=>{
    console.log('connected to the database.')
    app.listen(process.env.Port,()=>console.log(`server is listening on ${process.env.PORT || 5000}`))
})
.catch((err)=>{
    console.log("mongodb connection failed ",err);
})
