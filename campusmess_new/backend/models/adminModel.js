import mongoose from "mongoose";
// import hostel from "./hostelModel.js";

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true,
        unique:true,
    },
     email:{
         type: String,
        required:true,
        unique:true
    },
     contact:{
         type: String,
        // required:true,
        unique:true
    },
       password:{
         type: String,
        required:true
    },
       confirmPassword:{
         type: String,
    },
    studentLimit:{
        type:Number,
        default:10
    },
    currentIntake:{
        type:Number,
        default:0
    },
      hostels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "hostel"
  }]

})

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema)

export  default adminModel