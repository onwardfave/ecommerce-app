import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    // Generic error handling logic
    res.status(500).json({ message: error.message });
};
