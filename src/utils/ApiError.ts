import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./utility-class.js";

export const ApiError = (
    err: ErrorHandler,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    if (err.name === "CastError") err.message = "Invalid ID";

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ApiError