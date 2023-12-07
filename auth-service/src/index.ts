import express, { Request, Response } from 'express';
import { sequelize } from './models'; // Adjust the import path as needed
import authRoutes from './routes/auth.routes'
const app = express();
const PORT: string | number = process.env.AUTH_SERVICE_PORT || 3001;

app.use(express.json());

app.use('/api/v0/auth', authRoutes)

app.listen(PORT, async () => {
    console.log(`Auth Service listening on port ${PORT}`);
    // Sync Sequelize models
    try {
        await sequelize.sync({ force: true });
        console.log('Database connected at auth service!');
    } catch (error) {
        console.error('Unable to connect to the database at auth service:', error);
    }
});
