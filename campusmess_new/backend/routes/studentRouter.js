import express from 'express'

import { fetchMenuDetails, fetchStudentDetails, loginStudent, updateStatus } from '../controllers/studentController.js'

const studentRouter = express.Router();

studentRouter.post('/login',loginStudent)
studentRouter.post('/fetchStudentDetails',fetchStudentDetails)
studentRouter.post('/fetchMenuDetails',fetchMenuDetails)
studentRouter.post('/updateStatus',updateStatus)


export default studentRouter;