import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, type: 'access' | 'refresh'): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    let expiresIn = '1h'; // Default expiration for access tokens
    if (type === 'refresh') {
        expiresIn = '7d'; // Longer expiration for refresh tokens
    }

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};
