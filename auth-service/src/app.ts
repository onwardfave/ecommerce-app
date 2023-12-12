import express from 'express';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware'

const app = express();

app.use(express.json());
app.use(errorHandler)
app.use('/api/v0/auth', authRoutes);

export default app;
