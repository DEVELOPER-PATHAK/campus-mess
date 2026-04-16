import mongoose  from "mongoose";
import { updater } from "../cronJobs/resetJob.js";

// require('../cronJobs/resetJob');

 const connectDB = async()=>{
    mongoose.connection.on('connected',
        ()=>{
            console.log("Database is connected successfully")

             updater;


        }
    );
     await mongoose.connect(`${process.env.MONGODB_URI}/campusmess`)
}

export default connectDB;