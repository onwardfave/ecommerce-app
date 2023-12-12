import app from './app';
import { sequelize } from './models';

// types/express
interface UserBasicInfo {
    id: number;
    username: string;
    email: string;
    role: string
}

declare global {
    namespace Express {
        interface Request {
            user?: UserBasicInfo | null;
        }
    }
}

const PORT: string | number = process.env.AUTH_SERVICE_PORT || 3001;

app.listen(PORT, async () => {
    console.log(`Auth Service listening on port ${PORT}`);
    try {
        await sequelize.sync({ force: true });
        console.log('Database connected at auth service!');
    } catch (error) {
        console.error('Unable to connect to the database at auth service:', error);
    }
});
