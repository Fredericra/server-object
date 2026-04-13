
import type {Request,Response} from "express";

const login = (req:Request,res:Response)=>{
  return res.status(200).json({message:"Login successful"});
}


const User = {login}

export default User;