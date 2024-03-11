const mongoose=require("mongoose");

 
async function connectDB() {
   
  try {
       const databaseResponse= await mongoose.connect(process.env.MONGO_CONNECTION_URL);
      
        const databaseName = databaseResponse.connections[0].name;
        console.log(`Connected to the database: ${databaseName}`);
  } catch (error) {
      console.error('Connection error:', error.message);
  }

}

  module.exports=connectDB;