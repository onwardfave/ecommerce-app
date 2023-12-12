// types/express
interface UserBasicInfo {
    id: number;
    role: string
}

declare global {
    namespace Express {
        interface Request {
            user?: UserBasicInfo | null;
        }
    }
}

export { }