// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
        const decoded = jwt.verify(tokenBearer[1], c.config.jwt.secret) as JwtPayload;

        req.user = { id: decoded.id, role: decoded.role };
        console.log("User at authenticated: ", JSON.stringify((req as any).user));
        next();
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
        const decoded = jwt.verify(tokenBearer[1], c.config.jwt.secret) as any; // Adjust the type as needed

        // Check if roles are included in the token and contain 'admin'
        if (!decoded.role || decoded.role != 'admin') {
            return res.status(403).send({ message: 'Access denied. Admin role required.' });
        }

        // Optionally, you can attach the decoded token to the request for further use
        req.user = { id: decoded.id, role: decoded.role };

        return next();

    } catch (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate.' });
    }
}

