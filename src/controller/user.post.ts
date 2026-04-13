import type {  Response,Request } from 'express';


const header = async (req:Request,res:Response) => {
    try {
        res.status(200).json({message:"Header route is working"});
    } catch (error) {
        res.status(500).json({message:"Internal server error",error});
    }
}


const experience = async (req:Request,res:Response) => {
    try {
        res.status(200).json({message:"Experience route is working"});
    } catch (error) {
        res.status(500).json({message:"Internal server error",error});
    }
}

const skill = async (req:Request,res:Response) => {
    try {
        res.status(200).json({message:"Skill route is working"});
    } catch (error) {
        res.status(500).json({message:"Internal server error",error});
    }
}

const diploma = async (req:Request,res:Response) => {
    try {
        res.status(200).json({message:"Diploma route is working"});
    } catch (error) {
        res.status(500).json({message:"Internal server error",error});
    }
}

const project = async (req:Request,res:Response) => {
    try {
        res.status(200).json({message:"Project route is working"});
    } catch (error) {
        res.status(500).json({message:"Internal server error",error});
    }
}


export {
    header,
    experience,
    skill,
    diploma,
    project
}