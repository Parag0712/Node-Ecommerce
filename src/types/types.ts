import { NextFunction, Request, Response } from "express";

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface NewUserRequestBody {
    _id: string;
    name: string;
    email: string;
    photoUrl: string;
    gender: string;
    dob: Date;
}