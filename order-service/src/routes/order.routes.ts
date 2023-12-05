// routes/order.routes.ts
import express from 'express';
import { OrderController } from '../controllers/order.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', requireAuth, OrderController.createOrder);
router.get('/:id', requireAuth, OrderController.getOrderById);

export default router;
