import type { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import  Jwt  from "jsonwebtoken";
import Utility from "../Utility";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

config();

const keywebtoke = process.env.SECRET as string;

const midelware = async(req:Request,res:Response,next:NextFunction)=>{
    const authHeader =  req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] as string;

    if(!token) return res.json(await Utility.resParams({status:false,message:'token manquant',field:'tokenManque',data:null})).status(201)
    try{
    const decoded = Jwt.verify(token,keywebtoke);
    req.user = decoded;
    next(); 
    }catch(err)
    {
        return res.status(201).json(await Utility.resParams({status:false,field:'tokenIvalid',data:null})).status(404)
    }

}

export default midelware;