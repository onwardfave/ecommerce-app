import express, { Request, Response } from 'express';
import { register, login, refreshToken } from '../controllers/auth.controller';

const app = express();

app.use(express.json()); // Body parser middleware for JSON request bodies

// Registration route
app.post('/api/v0/auth/register', register);

// Login route
app.post('/api/v0/auth/login', login);

// Token refresh route
app.post('/api/v0/auth/refresh', refreshToken);

// ... additional routes as necessary

export default app;
