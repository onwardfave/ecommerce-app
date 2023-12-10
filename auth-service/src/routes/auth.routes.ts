import express, { Request, Response } from 'express';
import { register, login, refreshToken, baseAuth, getUserByID } from '../controllers/auth.controller';
const router = express.Router();

router.use(express.json()); // Body parser middleware for JSON request bodies

//base route
router.get('/', baseAuth)

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// Token refresh route
router.post('/refresh', refreshToken);

//get user with ID
router.get('/users/:userID', getUserByID)

// ... additional routes as necessary
export default router;
