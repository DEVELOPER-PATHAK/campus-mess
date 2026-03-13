import mongoose  from "mongoose";

 const connectDB = async()=>{
    mongoose.connection.on('connected',
        ()=>{
            console.log("Database is connected successfully")
        }
    );
     await mongoose.connect(`${process.env.MONGODB_URI}/campusmess`)
}

export default connectDB;