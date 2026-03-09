export const isAdmin = async(req, res, next) => {
  console.log(req.user.email);
  if(req.user.email !== "roy39316f@gmail.com"){
    return res.status(403).json({message : "Admin access required"});
  }
  next();
};
