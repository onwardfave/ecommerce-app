// src/errors/baseError.ts

export default class BaseError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public details?: any;

    constructor(name: string, statusCode: number, isOperational: boolean, description: string, details?: any) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}
