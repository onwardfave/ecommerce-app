// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        details: err.details || {},
        timestamp: new Date().toISOString()
    });
};
