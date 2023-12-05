// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as c from '../config/config'; // adjust the import path as necessary

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if (!req.headers?.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }

    const tokenBearer = req.headers.authorization.split(' ');
    if (tokenBearer.length != 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }

    if (!c.config.jwt.secret) {
        throw new Error('JWT secret is not configured.');
    }

    try {
        await jwt.verify(tokenBearer[1], c.config.jwt.secret);
        return next();
    } catch (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
    }

}
