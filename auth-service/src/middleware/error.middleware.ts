// src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import BaseError from '../utils/baseError.utils';
import logger from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof BaseError) {
        // Our custom error
        logger.error(err.message, { error: err });
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            details: err.details,
            timestamp: new Date().toISOString()
        });
    } else {
        // Default to 500 server error
        logger.error(err.message, { error: err });
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            timestamp: new Date().toISOString()
        });
    }
};
