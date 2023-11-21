import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { sendError, sendSuccess } from '../utils/response.utils'; // Assuming you have these functions
import jwt from 'jsonwebtoken';


export const register = async (req: Request, res: Response) => {
    try {
        const user = await UserService.createUser(req.body);
        return res.status(201).json(user);
    } catch (error: any) {
        // Error handling to be improved
        return res.status(400).json({ message: error.message });
    }
};

/**
 * Handles a login request.
 * @param req The request object containing information about the login request.
 * @param res The response object used to send a response back to the client.
 */
export const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 'Username and password are required.', 400);
        }

        const user = await UserService.validateUser(email, password);
        if (!user) {
            return sendError(res, 'Invalid username or password.', 401);
        }

        const { accessToken, refreshToken } = UserService.generateTokens(user.id.toString());
        return sendSuccess(res, { accessToken, refreshToken }, 'Login successful.');
    } catch (error) {
        console.error('Login failed:', error);
        return sendError(res, 'Login failed due to an internal error.', 500);
    }
};


export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return sendError(res, 'Refresh token is required', 400);
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as jwt.JwtPayload;

        // Check if the decoded token has an id property
        if (typeof decoded === 'object' && 'id' in decoded) {
            // Generate a new access token
            const newAccessToken = UserService.generateTokens(decoded.id).accessToken;
            return sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed successfully');
        } else {
            return sendError(res, 'Invalid token structure', 401);
        }
    } catch (error) {
        return sendError(res, 'Invalid or expired refresh token', 401);
    }
};
