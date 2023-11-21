import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 12);
};

export const comparePasswords = async (submittedPassword: string, storedHash: string): Promise<boolean> => {
    return bcrypt.compare(submittedPassword, storedHash);
};
