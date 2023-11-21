// validationUtils.ts
export const isValidEmail = (email: string): boolean => {
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
        return false;
    }
    const domain = emailParts[1];
    // Check if domain exists
    // ...
    if (!email.includes('@')) {
        return false;
    }
    return true;
};

