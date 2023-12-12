import express from 'express';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());
app.use('/api/v0/auth', authRoutes);

// Centralized error handler
app.use(errorHandler);

export default app;
