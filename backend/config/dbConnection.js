import mongoose from "mongoose";

const URL="mongodb+srv://root:9115436309@cluster0.dc1zkju.mongodb.net/Auth-detail?appName=Cluster0/"

const connectDB = async () =>{
  await mongoose.connect(URL).then(()=>{
    console.log("DB is connected");
  }).catch((err)=>{
    console.log("error while connecting to the DB",err)
  })
}

export default connectDB;