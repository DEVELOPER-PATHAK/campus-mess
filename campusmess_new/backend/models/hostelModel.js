import mongoose from "mongoose";
// import hostelModel from "./studentModel.js";

const hostelSchema = new mongoose.Schema({
    hostelNo:{
        type:String,
        required:true
    },
    hostelName:{
        type:String,
        required:true,
    },
    instituteId:{
         type:String,
        required:true,
        // unique:true,
    },
    studentIntake:{
        type:Number,
        default:0
    },
    students:[{
         type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    }]
})


// const hostelModel = mongoose.models.hostel ||  mongoose.model("hostel", hostelSchema);

// export  default hostelModel


const hostelModel =
  mongoose.models.hostel || mongoose.model("hostel", hostelSchema);

export default hostelModel;


