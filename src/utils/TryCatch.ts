import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/types.js";

export const TryCatch = (requestHandler: ControllerType) =>{
    return (req:Request,res:Response,next:NextFunction)=>{
        return Promise.resolve(requestHandler(req,res,next)).catch(next)
    }
}

