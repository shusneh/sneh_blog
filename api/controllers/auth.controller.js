import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";

export const signup = async(req,res)=>{
    const {username, email, password} = req.body;

    if(!username||!email|| !password || username==="" || email==="" || password===""){
        next(errorHandler(400, "All fields are mandatory"));
    }

    const hashPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({
        username,
        email,
        password : hashPassword  
    }); 

    try {
        await newUser.save();
        res.status(200).json({message : "SignUp Successful"});    
    } catch (err) {
        res.json({message : err.message,success:"false"}); // why we cant ue next here !!
    }

    
}