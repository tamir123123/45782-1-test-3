// src/middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('An unhandled error occurred:', err.stack || err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong on the server!';

    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: message,
        ...(err.details && { details: err.details })
    });
};