export const isAdmin = async(req, res, next) => {
  if(req.user.email !== "roy3936f@gmail.com"){
    return res.status(403).json({message : "Admin access required"});
  }
  next();
};
