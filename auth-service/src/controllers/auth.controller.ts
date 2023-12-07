import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { sendError, sendSuccess } from '../utils/response.utils'; // Assuming you have these functions
import jwt from 'jsonwebtoken';



/**
     * Handles an HTTP request and response.
     * Returns a JSON response with a message indicating that the authentication service is running okay.
     * 
     * @param req - The HTTP request object containing information about the incoming request.
     * @param res - The HTTP response object used to send a response back to the client.
*/
export const baseAuth = async (req: Request, res: Response) => {
    res.status(200).json({ message: "Auth service is running okay" })
}


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


/**
    * Refreshes the access token using the provided refresh token.
    * 
    * @param req - The request object containing the refresh token in the request body.
    * @param res - The response object used to send the new access and refresh tokens.
    * @returns A Promise that resolves to the new access and refresh tokens.
   */

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

/**
 * Fetches a user for a user with the given userID
 * @param req The request object containing information about the fetch user request.
 * @param res The response object used to send a response back to the client.
 */

export const getUserByID = async (req: Request, res: Response) => {
    const userID = req.params.userID;
    if (!userID) {
        return sendError(res, 'Invalid userID');
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return sendError(res, 'Unauthorized', 401);
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        const user = await UserService.getUserByID(userID);
        sendSuccess(res, user);
    } catch (error: any) {
        sendError(res, error.message);
    }
}
