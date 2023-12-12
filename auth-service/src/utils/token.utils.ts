import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, role: string, type: 'access' | 'refresh'): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    let expiresIn = '1h'; // Default expiration for access tokens
    if (type === 'refresh') {
        expiresIn = '7d'; // Longer expiration for refresh tokens
    }

    // Include user roles in the token payload
    const payload = {
        id: userId,
        role: role,
        type: type
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

