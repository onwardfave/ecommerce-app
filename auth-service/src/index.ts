import express, { Request, Response } from 'express';
import { sequelize } from './models'; // Adjust the import path as needed
import authRoutes from './routes/auth.routes'
const app = express();
const PORT: string | number = process.env.AUTH_SERVICE_PORT || 3001;

app.use(express.json());

app.get('/api/v0/auth', (req: Request, res: Response) => {
    res.send('Auth Service is running...');
});

app.use('/api/v0', authRoutes)

app.listen(3001, '0.0.0.0', async () => {
    console.log(`Auth Service listening on port ${PORT}`);
    // Sync Sequelize models
    try {
        await sequelize.sync({ force: true });
        console.log('Database connected at auth service!');
    } catch (error) {
        console.error('Unable to connect to the database at auth service:', error);
    }
});
