import mongoose  from "mongoose";

const menuSchema = new mongoose.Schema({   
    instituteId:{
         type:String,
        required:true,
    },
     hostelNo:{
         type:String,
        required:true,
    },
    breakfast:{
        type :String,
    },
    lunch:{
        type :String,
    },
    dinner:{
        type :String,
    },
    price:{
        type: String,
    }
})


const menuModel =
  mongoose.models.menu || mongoose.model("menu", menuSchema);

export default menuModel;