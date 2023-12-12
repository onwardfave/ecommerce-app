import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { comparePasswords } from '../utils/password.utils';
import { generateToken } from '../utils/token.utils';
import { hashPassword } from '../utils/password.utils';
import { ROLES } from '../config/roles.config';


export class UserService {

    static async createUser(userData: any): Promise<User> {
        // Clone the userData object to avoid mutating the original
        const userDataCopy = { ...userData };

        // Set default role if not provided
        userDataCopy.role = userDataCopy.role || ROLES.USER;

        // Hash password
        const hashedPassword = await bcrypt.hash(userDataCopy.password, 12);
        userDataCopy.password = hashedPassword;

        // Create and return new user
        let user = await User.create(userDataCopy);

        console.log("Created User:", JSON.stringify(user))

        return user;
    }


    static async validateUser(email: string, password: string): Promise<User | null> {

        const user = await this.getUserByEmail(email);

        //console.log("User,", JSON.stringify(user));

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        //console.log("Is password valid, ", isPasswordValid)

        return isPasswordValid ? user : null;
    }


    /**
     * Retrieves a user by their username.
     * @param username - The username of the user to retrieve.
     * @returns A Promise that resolves to a User object representing the user with the specified username, or null if no user is found.
     */
    static async getUserByEmail(email: string, fields?: string[]): Promise<User | null> {
        try {
            const options: any = {
                where: { 'email': email }
            };

            if (fields) {
                options.attributes = fields;
            }

            const user = await User.findOne(options);
            return user || null;

        } catch (error: any) {
            console.error(`Failed to retrieve user by email: ${error.message}`);
            throw new Error(`Failed to retrieve user by email: ${error.message}`);
        }
    }


    static generateTokens(userId: string, role: string): { accessToken: string; refreshToken: string } {
        const accessToken = generateToken(userId, role, 'access'); // Generate access token
        const refreshToken = generateToken(userId, role, 'refresh'); // Generate refresh token

        // Optionally, save refreshToken to the database for the user

        return { accessToken, refreshToken };
    }

    static async getUserByID(userID: string, fields?: string[]): Promise<User | null> {
        try {
            const options: any = {
                where: { id: userID }
            };

            if (fields) {
                options.attributes = fields;
            }

            const user = await User.findOne(options);
            return user || null;
        } catch (error: any) {
            console.error(`Failed to retrieve user by ID: ${error.message}`);
            throw new Error(`Failed to retrieve user by ID: ${error.message}`);
        }
    }

}

