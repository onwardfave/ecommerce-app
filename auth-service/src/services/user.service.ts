import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { comparePasswords } from '../utils/password.utils';
import { generateToken } from '../utils/token.utils';
import { hashPassword } from '../utils/password.utils';



export class UserService {

    static async createUser(userData: any): Promise<User> {
        // Clone the userData object to avoid mutating the original
        const userDataCopy = { ...userData };

        // Hash password
        const hashedPassword = await bcrypt.hash(userDataCopy.password, 12);
        userDataCopy.password = hashedPassword;

        // Create and return new user
        return User.create(userDataCopy);
    }


    static async validateUser(email: string, password: string): Promise<User | null> {

        const user = await this.getUserByEmail(email);

        if (!user) {
            console.log('User not found for email:', email);
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        return isPasswordValid ? user : null;
    }


    /**
     * Retrieves a user by their username.
     * @param username - The username of the user to retrieve.
     * @returns A Promise that resolves to a User object representing the user with the specified username, or null if no user is found.
     */
    static async getUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await User.findOne({ where: { 'email': email } });

            return user || null;
        } catch (error: any) {
            console.error(`Failed to retrieve user by email: ${error.message}`);
            throw new Error(`Failed to retrieve user by email: ${error.message}`);
        }
    }

    static generateTokens(userId: string): { accessToken: string; refreshToken: string } {
        const accessToken = generateToken(userId, 'access'); // Generate access token
        const refreshToken = generateToken(userId, 'refresh'); // Generate refresh token

        // Optionally, save refreshToken to the database for the user

        return { accessToken, refreshToken };
    }

}

