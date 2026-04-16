// import React from 'react'

import adminModel from "../models/adminModel.js";


export const verifyIntake = async (req,res,next)=>{
try {
    
        const {instituteId}= req.params;
        if(!instituteId){
            return res.json({
                success:false,
                message:"can not find college id"
            })
        }
    
         const adm= await adminModel.findOne({id:instituteId});
    
         if(!adm){
               return res.json({
                success:false,
                message:"can not find college"
            })
         }
    
         if(adm.currentIntake +1 > adm.studentLimit){
            console.log("limit reached");
            return res.json({
                success:false,
                message:"limit has been reached "
            })
         }
    
         next();
} catch (error) {
    console.log(error);
      return res.json({
                success:false,
                message:"not able to proceed"
            })
}



}