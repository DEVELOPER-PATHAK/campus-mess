
import adminModel from "../models/adminModel.js";
import jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt'
import hostelModel from "../models/hostelModel.js";
import studentModel from "../models/studentModel.js";
import menuModel from "../models/menuModel.js";
// import { sendEmail } from "../utils/sendEmail.js";
import { sendEmail } from "../util/sendEmail.js";
// const QRCode = require("qrcode");
import QRCode from "qrcode"

export const registerAdmin= async (req,res)=>{
    try {     
        const {instituteName,instituteId,email,contact,password,confirmPassword}= req.body;

        if(!instituteName || !email || !instituteId||  !contact || !password || !confirmPassword){
            return res.json({
                success:false,
                message:"missing details"
            })
        }

        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"password and confirm password do not match"
            })
        }

        const existedUser= await adminModel.findOne({id:instituteId});
        if(existedUser){
            return res.json({
                success:false,
                message:"institute with same id already registered"
            })
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        const adminData={name:instituteName,email,id:instituteId,password:hashedPassword,contact}

        const newAdmin= new adminModel(adminData)

        const admin= await newAdmin.save();

        const token= jwt.sign({
            id:admin._id}, process.env.JWT_SECRET)
        
        res.json({
            success:true,
            token,
            admin
        })


    } catch (error) {
         console.log(error);
                res.json({success: false,
                message: error.message
            })
    }
}


export const loginAdmin= async (req,res)=>{

    try {
          const {instituteName,instituteId,password}= req.body
    if(!instituteName || !instituteId || !password){
        return res.json({
            success:false,
            message:"login details missing"
        })
    }

    const admin= await adminModel.findOne({id:instituteId});
    if(!admin){
        return res.json({
            success:false,
            message:"this institute does not registered"
        })
    }

    const isMatch = await bcrypt.compare(password,admin.password)
    if(isMatch){
        const token = jwt.sign({id:admin._id},process.env.JWT_SECRET)
    
    res.json({
        success:true,
        token,
        admin
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



export const addHostel = async (req, res) => {
  try {
    console.log("reached backend");
    const {instituteId} = req.params;
    const {hostelNo, hostelName} = req.body;

    if (!hostelName || !hostelNo) {
      return res.json({
        success: false,
        message: "enter all the details"
      });
    }

   

      const adm = await adminModel.findOne({ id: instituteId }).populate("hostels");
      // const adm = Object.values(ad);

      console.log(adm.hostels);

    if (!adm) {
      return res.json({
        success: false,
        message: "institute with this id does not exist"
      });
    }

   

     const duplicate = adm.hostels.find(
      h => String(h.hostelNo) === String(hostelNo)
    );
      if (duplicate) {
        return res.json({
          success: false,
          message: "Hostel with same hostelNo already exists"
        });
      }
    

    // Create hostel
    const hostelData = {instituteId, hostelName, hostelNo};
    const newHostel = new hostelModel(hostelData);
    const hostel = await newHostel.save();

    // Save reference on admin: push if array, otherwise set

     adm.hostels.push(hostel._id);
    await adm.save();


    return res.json({
      success: true,

      hostel
    });


  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};


export const sendHostels  = async(req,res) =>{
  try {
     const {instituteId} = req.params;
     if(!instituteId){
          return res.json({
            success:false,
            message:"unable to get institute id"
          }
        );
      }

     const adm = await adminModel.findOne({ id: instituteId }).populate("hostels");
     console.log(adm);
     if(!adm){
       return res.json({
            success:false,
            message:"unable to get institute with this id"
          }
        );
     }
     const listHostels= adm.hostels;

     console.log(listHostels);

     if(listHostels){
        return res.json({
          success:true,
          listHostels
        })
     }
     else{
      return res.json({
        success:false,
        message:"no hostel exists"
      })
     }



  } catch (error) {
      console.log(error);
        return res.json({
      success: false,
      message: error.message
    });

  }
};


export const deleteHostel = async (req, res) => {
  try {
    console.log("reached backend");
    const {instituteId} = req.params;
    const { id } = req.body;

    if (!id) {
      return res.json({
        success: false,
        message: "hostel id is not obtained"
      });
    } 
      const adm2 = await adminModel.findOne({ id: instituteId });
      if(!adm2){
         return res.json({
        success: false,
        message: "unable to fetch institute"
      });
      }

      adm2.hostels.pull(id);
      await adm2.save();
    
     const deletedHostel = await hostelModel.findByIdAndDelete(id);

  if(!deleteHostel){
  return res.json({
    success:false,
    message:"given hostel does not exists in hostel model"
  })
}

    return res.json({
      success: true,

      deletedHostel
    });


  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};



export const addStudent = async (req,res)=>{
  try {

    const { instituteId, hostelId } = req.params;
    const { name, scholarNo, email, password } = req.body;
    const hostelNo = hostelId;

    if(!instituteId || !hostelNo){
      return res.json({ success:false, message:"Institute/Hostel missing" });
    }
      // console.log("1")

    if(!name || !scholarNo || !email || !password){
      return res.json({ success:false, message:"Enter all details" });
    }
    // console.log("1")
    // check if student already exists
    const existingStudent = await studentModel.findOne({ scholarNo });
    if(existingStudent){
      return res.json({
        success:false,
        message:"Student already exists with this scholar number"
      });
    }

      // console.log("1")

    // create student
    const studentData ={ name, scholarNo, email, password, instituteId, hostelNo };
    const std = await studentModel.create(studentData);

    //  const qrData = `http://localhost:4000/api/student/qr/${std.scholarNo}`;
     const qrImage = await QRCode.toDataURL(scholarNo);

    //console.log(qrImage);

     std.qrCode= qrImage;
     await std.save();

    // find hostel and attach student
    const hostel = await hostelModel.findOne({ hostelNo, instituteId });

      // console.log("1")

    if(!hostel){
      return res.json({
        success:false,
        message:"Hostel not found"
      });
    }

    hostel.students.push(std._id);
    await hostel.save();
      console.log("1")

    console.log(std);
    return res.json({
      success:true,
      student: std
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success:false,
      message:error.message
    });
  }
};




export const sendStudents  = async(req,res) =>{
  try {
     const {instituteId, hostelId} = req.params;
     if(!instituteId || !hostelId){
          return res.json({
            success:false,
            message:"unable to get institute id and hostel id" 
          }
        );
      }      
    const students = await studentModel.find({
      instituteId: instituteId,
      hostelNo: hostelId
    });

    if(!students){
       return res.json({
        success:false,
        message:"cannot fetch the students details"
       })
    }

    return res.json({
      success:true,
      students
    })

  } catch (error) {
      console.log(error);
        return res.json({
      success: false,
      message: error.message
    });

  }
};



export const deleteStudent = async (req, res) => {
  try {

    const {instituteId ,hostelId} = req.params;
    const { id } = req.body;

    if (!id) {
      return res.json({
        success: false,
        message: " student id is not obtained"
      });
    } 
      
      const host = await hostelModel.findOne({ instituteId: instituteId , hostelNo: hostelId });
      if(!host){
         return res.json({
        success: false,
        message: "unable to fetch the hostel model"
      });
      }

     
      host.students.pull(id);
      await host.save();

        
    
     const deletedStudent = await studentModel.findByIdAndDelete(id);

  if(!deletedStudent){
  return res.json({
    success:false,
    message:"given student data does not exist in student model"
  })
}
    
    return res.json({
      success: true,
      deletedStudent

    });


  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    })
  }
};

export const updateMenu = async (req,res)=>{
 try {
    const {instituteId,hostelId}= req.params;
    const {breakfast,lunch,dinner , price}= req.body;
 
    if(!instituteId || !hostelId){
     return res.json({
       success:false,
       message:"unable to fetch hostel "
     })
    }
    if(!lunch || !breakfast || !dinner || !price){
     return res.json({
       success:false,
       message:"enter all the details"
     })
    }
 
    const menu= await menuModel.findOne({instituteId,hostelNo: hostelId})
       const menuData = {instituteId, hostelNo: hostelId, breakfast,lunch,dinner,price};
    if(!menu){
      
         const newMenu = new menuModel(menuData);
         const curr= await newMenu.save();
 
         res.json({
           success:true,
           curr
         })
    }
    else{
         const curr=await menuModel.findOneAndUpdate({
           instituteId,hostelNo:hostelId
         },
         {
         $set: menuData
         },
         {
           new:true
         }
 
       ) 
       
         res.json({
           success:true,
           curr
         })
    }
 } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    })
 }


};


export const sendMenu = async ( req, res)=>{

  const { instituteId, hostelId } = req.params;  
  try {
      if(!instituteId || !hostelId){
       return res.json({
         success:false,
         message:"unable to fetch hostel "
       })
      }
      const menu= await menuModel.findOne({instituteId,hostelNo: hostelId})
  
      if(menu){
        res.json({
          success:true,
          menu
        })
      }
      else{
        res.json({
          success:false,
          message:"menu is not created till now"
        })
      }
  } catch (error) {

     console.error(error);
    return res.json({
      success: false,
      message: error.message
    })
 }
    
  }


export const exportEmail = async (req, res) => {
  try {
    const { name, email , password ,qr } = req.body;

    // Save student to DB here...
  

    // Send welcome email
   const htmlContent = `
  <h2>Welcome ${name}</h2>
  <p>You have successfully registered into campusmess.</p>
  <p>Your password is ${password}.</p>
`;
 

    await sendEmail(email, "Registration Successful", htmlContent);

    res.status(200).json({
      success: true,
      message: "Student registered and email sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const verifyStudent = async (req,res)=>{
   try {
    // console.log("arpit jhatu")
    const {scholarNo,price}= req.body;

    
    if(!scholarNo){
      return res.json({
        success:false,
        message:"unable to fetch scholar no "
      })
    }
    //  console.log("arpit jhatu")

    const student= await studentModel.findOne({scholarNo});

    if(!student){
         return res.json({
        success:false,
        message:"no student found with this scholar no  "
      })
    }
    //  console.log("arpit jhatu")

    if(student.status== "Eating"){
      return res.json({
        success:true,
        verify:1,
        message:"student is verified successfully"
      })
    }
    else{
        student.saved=   String(Number(student.saved)- price);
        student.fine=  String(Number(student.fine) + 29);
        student.status= "Eating";

        await student.save();

        return res.json({
          success:true,
          verify:0,
          message:"student had opt for notEating so fine of Rs29 is imposed"
        })

    }

    //  console.log("arpit jhatu")


   } catch (error) {
     res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
   }
}

