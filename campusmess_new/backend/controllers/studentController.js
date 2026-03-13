import menuModel from "../models/menuModel.js";
import studentModel from "../models/studentModel.js";

import jwt from "jsonwebtoken";

export const loginStudent = async(req,res)=>{
    try {

        const {name ,scholarNo,instituteName,password,hostelNo}= req.body;
        if(!name || !scholarNo || !password ||!hostelNo || !instituteName){
            return res.json({
                success:false,
                message:"login details missing"
            })
        }
 

        const student= await studentModel.findOne({scholarNo})

        if(!student){
            return res.json({
                success:false,
                message:"student does not exists"
            })
        }


        const isMatch =  password === student.password;

        if(isMatch){
             const token = jwt.sign({id:student._id},process.env.JWT_SECRET)
              res.json({
             success:true,
             token,
             student
    })

        }
        else{
              return res.json({
            success:false,
            message:"invalid credentials"
        })
        }


    } catch (error) {
         console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

export const fetchStudentDetails = async(req,res)=>{

   try {

    // console.log("rech condfd")
     const {scholarNo}=  req.body;
 
     if(!scholarNo){
        return res.json({
         success:false,
         message:"unable to get scholar number"
        })
     }
//  console.log("rech condfd")
     
     const student= await studentModel.findOne({scholarNo});
 
     if(!student){
         return res.json({
             success:false,
             message:"to details found for the give scholar number"
         })
     }
    //  console.log("rech condfd")
 
     return res.json({
         success:true,
         student
     })
   } catch (error) {   
      console.log(error);
        res.json({
            success:false,
            message:error.message
        })
   }


}

export const fetchMenuDetails= async(req,res)=>{

    try {
        
        const {hostelNo, instituteId}= req.body;
        if(!hostelNo || !instituteId){
            return res.json({
                success:false,
                message:"unable to get hostelNo and institute id"
            })
        }

        const menu= await menuModel.findOne({hostelNo, instituteId});

        if(!menu){
            return res.json({
                success:false,
                message:"menu could not be fetched"
            })
        }


        return res.json({
            success:true,
            menu
        })


    } catch (error) {
         console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}

export const updateStatus= async (req,res)=>{
 try {
       const {scholarNo, price, status}= req.body;

       
   
       if(!scholarNo || !price || !status){
           return res.json({
               success:false,
               message:"unable to get parameter"
           })
       }
   
       
        const student= await studentModel.findOne({scholarNo});
   
        if(!student){
            return res.json({
               success:false,
               message:"no student exist in database"
           })
        }
     
   
        student.status= status;
        let curr= Number(student.saved)
   
        if(status==="Eating"){
            curr=curr - price;
        }
        else if(status==="notEating"){
           curr=curr+price
        }
        
        console.log(curr);
        // const val= String(curr);
        student.saved= String(curr);
   
        await student.save();

        console.log("ferghgfd");
   
        return res.json({
           success:true,
           student
        })
 } catch (error) {
     console.log(error);
        res.json({
            success:false,
            message:error.message
        })
 }
    
}
