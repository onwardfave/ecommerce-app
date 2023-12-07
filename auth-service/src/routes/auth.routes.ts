import express, { Request, Response } from 'express';
import { register, login, refreshToken, baseAuth } from '../controllers/auth.controller';

const app = express();

app.use(express.json()); // Body parser middleware for JSON request bodies

//base route
app.get('/', baseAuth)

// Registration route
app.post('/register', register);

// Login route
app.post('/login', login);

// Token refresh route
app.post('/refresh', refreshToken);

//get user with ID
app.get('/users/:userID', getUserByID)

// ... additional routes as necessary
export default app;
