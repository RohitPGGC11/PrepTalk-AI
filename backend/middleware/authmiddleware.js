import jwt from "jsonwebtoken";
import {z} from "zod";


export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token expired" });
  }
};


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