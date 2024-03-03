import { NextFunction, Request, Response } from "express";

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

// User Data
export interface NewUserRequestBody {
    _id: string;
    name: string;
    email: string;
    photo: string;
    gender: string;
    dob: Date;
}

// Product Data
export interface NewProductRequestBody{
    name:string,
    category:string,
    price:number,
    stock:number
}