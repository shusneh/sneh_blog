import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

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


// export const signin =async (req,res, next)=>{
//     const {email, password} = req.body;
//     if(!email || !password || email==='' || password===''){
//         return next(errorHandler(400, 'All fields are required'));
//     }

//     try {
//         const validUser= await User.findOne({email});
//         if(validUser === false){
//             const mess=errorHandler(400,'Invalid credentials' );
//            return res.json(mess);
//             // res.status(400).json({"message":'Invalid creden'});
//         }

//         // If you are using bcrypt on a simple script, 
//         // using the sync mode is perfectly fine. However,
//         // if you are using bcrypt on a server, the async
//         //  mode is recommended. This is because the hashing 
//         //  done by bcrypt is CPU intensive, so the sync 
//         //  version will block the event loop and prevent your 
//         //  application from servicing any other inbound requests or events. 
//         //  The async version uses a thread pool which does not
//         //  block the main event loop.
        
//         const validPass = bcryptjs.compareSync(password, validUser.password);
//         if(validPass===false){
//             const mess=errorHandler(400,'Invalid credentials' );
//            return res.json(mess);
//             // return res.status(400).json({"message":'Invalid creden'});
//         }
//         const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);

//         res
//         .status(200)
//         .cookie('access_tocken',token,{ 
//             httpOnly: true,
//         })
//         .json(validUser);
 



//     } catch (error) {
//         next(error);
//     }
// }

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password || email === '' || password === '') {
      next(errorHandler(400, 'All fields are required'));
    }
  
    try {
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, 'User not found'));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, 'Invalid password'));
      }
      const token = jwt.sign(
        { id: validUser._id},
        process.env.JWT_SECRET
      );
  
    const {password: pass, ...rest} = validUser._doc; 
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest  );
    } catch (error) {
      next(error);
    }
  };
  