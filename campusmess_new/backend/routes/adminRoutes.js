import express from 'express'
// import registerAdmin from 
import { registerAdmin,loginAdmin, addHostel, sendHostels, deleteHostel, addStudent, sendStudents, deleteStudent, updateMenu, sendMenu, exportEmail, verifyStudent, createOrder, verifyPayment, updateCapacity } from '../controllers/adminController.js';
import { verifyIntake } from '../middlewares/verifyIntake.js';



const adminRouter = express.Router();

adminRouter.post('/register',registerAdmin)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/addHostel/:instituteId', addHostel)
adminRouter.get('/fetchHostel/:instituteId', sendHostels)
adminRouter.post('/removeHostel/:instituteId', deleteHostel)
adminRouter.post('/addStudent/:instituteId/:hostelId',verifyIntake ,addStudent)
adminRouter.get('/fetchStudents/:instituteId/:hostelId', sendStudents)
adminRouter.post('/removeStudent/:instituteId/:hostelId', deleteStudent)
adminRouter.post('/updateMenu/:instituteId/:hostelId', updateMenu)
adminRouter.get('/fetchMenu/:instituteId/:hostelId', sendMenu)
adminRouter.post('/sendEmail', exportEmail)
adminRouter.post('/verifyStudent', verifyStudent)

adminRouter.post('/create-order', createOrder);
adminRouter.post('/verify-payment', verifyPayment);

 adminRouter.post('/updateCapacity/:instituteId', updateCapacity)





export default adminRouter; 