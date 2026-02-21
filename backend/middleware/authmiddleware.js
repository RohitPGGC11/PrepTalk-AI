import {z} from "zod";
import jwt from "jsonwebtoken";
//validate the user credibility by token

export const ensureAuthenticate = (req,res,next) =>{
    const authHeader =req.headers.authorization;
    if(!authHeader){
      return res.json({success:false,message:"token is not available"})
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.userId=decoded.id;
        next()
    } catch (error) {
        
        console.log(error);
        return res.json({success:false,message:"correct jwt token is required"})
    }
   
}

//validate the credentials format SChema
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});
//validate the credentials
export const validate =(schema) =>
  (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.json({
        success: false,
        message:"somthing is not correct",
      });
    }
  };
