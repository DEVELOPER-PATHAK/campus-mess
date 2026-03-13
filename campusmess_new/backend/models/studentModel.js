import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    
    name:{
        type: String,
        required:true
    },
    scholarNo:{
        type:String,
        required:true
    },
    instituteName:{
        type:String,
        //  required:true,
    },
    instituteId:{
        type:String,
        required:true,
    },
    hostelNo:{
        type:String,
        required:true,
    },
    email:{
         type: String,
        // required:true,
        unique:true
    },
    fine:{
        type:String,
        default:"0"
    },
    saved:{
        type:String,
        default:"0"
    },
    status:{
         type: String,
        default:"Eating"
        // unique:true
        // notEating
        
    },
    password:{
         type: String,
        required:true
    },
    qrCode:{
        type:String,
        default:"none"
    }

})


const studentModel = mongoose.models.student || mongoose.model("student", studentSchema)

export default studentModel