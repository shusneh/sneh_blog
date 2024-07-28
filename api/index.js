import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js' 
import postRoutes from './routes/post.route.js'
import cookieParser from 'cookie-parser'


dotenv.config();
mongoose.connect(process.env.MONGO)
.then(console.log('Database is connected')) 
.catch((err)=>console.log(err));
 
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);


app.listen(3000,()=>{
    console.log("server is running at 3000!"); 
}) 