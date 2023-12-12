// responseUtils.ts
import { Response } from 'express';
import logger from './logger'

export const sendSuccess = (res: Response, data: any, message: string = 'Success') => {
    res.status(200).json({ message, data });
};

export const sendError = (res: Response, message: string, statusCode: number = 400, errorDetails = {}) => {
    // Log the error using Winston
    logger.error(message, {
        statusCode,
        errorDetails,
        // Additional context can be added here if necessary
    });

    // Send the error response
    res.status(statusCode).json({
        error: {
            code: statusCode,
            message: message,
            details: errorDetails
        }
    });
};

