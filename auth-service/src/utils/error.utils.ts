import BaseError from './baseError.utils';

export class ValidationError extends BaseError {
    constructor(description: string) {
        super('ValidationError', 400, true, description);
    }
}


export class AuthenticationError extends BaseError {
    constructor(description: string) {
        super('AuthenticationError', 401, true, description);
    }
}

export class DatabaseError extends BaseError {
    constructor(description: string, details?: any) {
        super('DatabaseError', 500, true, description, details);
    }
}