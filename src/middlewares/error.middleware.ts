import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";

export const errorMiddleware = (
    err: ErrorHandler,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;
    if (err.name === "CastError") err.message = "Invalid ID";
    if (err.code === 11000 && err.keyPattern?.email === 1) {
        err.message = "Email address already exists";
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default errorMiddleware