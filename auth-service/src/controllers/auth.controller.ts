import { Request, Response, NextFunction } from 'express';

import { UserService } from '../services/user.service';
import { ValidationError, AuthenticationError, DatabaseError } from '../utils/error.utils';
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
        console.log('User in Controller:', user); // Log to verify the received user
        return res.status(201).json(user);
    } catch (error: any) {
        console.error('Error in Controller:', error); // Log any errors
        return res.status(400).json({ message: error.message });
    }
};

/**
 * Handles a login request.
 * @param req The request object containing information about the login request.
 * @param res The response object used to send a response back to the client.
 */
export const login1 = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 'Username and password are required.', 400);
        }

        const user = await UserService.validateUser(email, password);
        if (!user) {
            return sendError(res, 'Invalid username or password.', 401);
        }

        // Assuming 'user' object has a 'roles' field that is an array of role names
        const role = user.role; // Replace with actual method to get roles

        const { accessToken, refreshToken } = UserService.generateTokens(user.id.toString(), role);
        return sendSuccess(res, { accessToken, refreshToken }, 'Login successful.');
    } catch (error) {
        console.error('Login failed:', error);
        return sendError(res, 'Login failed due to an internal error.', 500);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ValidationError('Username and password are required.');
        }

        const user = await UserService.validateUser(email, password);
        if (!user) {
            throw new AuthenticationError('Invalid username or password.');
        }

        const tokens = UserService.generateTokens(user.id.toString(), user.role);
        res.status(200).json({ tokens, message: 'Login successful.' });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
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

        if (typeof decoded === 'object' && 'id' in decoded) {
            // Fetch the latest roles of the user from the database
            const user = await UserService.getUserByID(decoded.id);
            if (!user) {
                return sendError(res, 'User not found', 401);
            }

            // Assuming user.roles is an array of roles
            const roles = user.role || '';

            // Generate a new access token with the latest roles
            const newAccessToken = UserService.generateTokens(decoded.id, roles).accessToken;

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
    //const loggedInUserId = req.user.id; // Adjust depending on how the user ID is stored in the token

    if (!userID) {
        return sendError(res, 'Invalid userID');
    }

    // Check if the requested user ID matches the logged-in user's ID
    /*if (requestedUserId !== loggedInUserId) {
        return res.status(403).json({ message: "Forbidden: You can only access your own details." });
    }*/

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
