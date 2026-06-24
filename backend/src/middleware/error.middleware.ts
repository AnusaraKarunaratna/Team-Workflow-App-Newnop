import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorMiddleware = ( err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongo duplicate key error
    if(err.code === 11000) {
        statusCode = 400;
        message = "Duplicate filed value";
    }

    res.status(statusCode).json({success: false, message, });
};