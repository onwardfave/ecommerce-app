// responseUtils.ts
import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message: string = 'Success') => {
    res.status(200).json({ message, data });
};

export const sendError = (res: Response, message: string, statusCode: number = 400) => {
    res.status(statusCode).json({ message });
};
