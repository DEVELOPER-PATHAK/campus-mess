import express from 'express'
import cors from 'cors'
import 'dotenv/config'
const PORT=process.env.PORT || 4000
const app= express()
import connectDB  from './config/mongodb.js'
import adminRouter from './routes/adminRoutes.js'
import studentRouter from './routes/studentRouter.js'


await connectDB();

app.use(express.json());
app.use(cors())


app.use('/api/admin', adminRouter)
app.use('/api/student', studentRouter)

app.get('/',
    (req,res)=> res.send("API IS WORKING FINE")
)

app.listen(PORT,
    ()=> console.log('server is running on  port '+PORT)
)

export default app;
