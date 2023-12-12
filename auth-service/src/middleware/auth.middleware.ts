// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as c from '../config/config'; // adjust the import path as necessary
import { User } from '../models/user.model';
import { UserService } from '../services/user.service'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded; // Add the decoded token to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};


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

        const decoded = jwt.verify(tokenBearer[1], c.config.jwt.secret) as JwtPayload;
        console.log("Decoded: ", JSON.stringify(decoded))

        if (!decoded || !decoded.id) {
            return res.status(401).send({ message: 'Not authorized, userId not found' });
        }

        const user = await UserService.getUserByID(decoded.userId, ["id", "email"]);

        req.user = user;

        return next();

    } catch (err) {

        return res.status(401).send({ auth: false, message: 'Failed to authenticate.' });

    }

}


export async function authorizeAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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
        const decoded = jwt.verify(tokenBearer[1], c.config.jwt.secret) as JwtPayload;
        if (!decoded || !decoded.id) {
            return res.status(401).send({ message: 'Not authorized, userId not found' });
        }

        const user = await UserService.getUserByID(decoded.id, ["id", "email", "role"]);
        if (!user) {
            return res.status(401).send({ message: 'User not found.' });
        }

        // Check if the user has the 'admin' role
        if (user.role !== 'admin') {
            return res.status(403).send({ message: 'Access denied. Admin role required.' });
        }

        req.user = user; // Attach the user to the request object

        return next();

    } catch (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate.' });
    }
}