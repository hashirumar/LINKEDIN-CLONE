import mongoose  from "mongoose";

export const connectDB = async ()=>{
    try{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected: ${con.connection.host}")
    }
    //The placeholder ${con.connection.host} dynamically inserts the host 
    // address of the connected database.
    catch(error){
      console.error('Error connecting  to MongoDB: ${error.message}');
      process.exit(1);
      //Exits the Node.js process with a failure code (1) to indicate that 
      // the application encountered a critical error.
    }
};

