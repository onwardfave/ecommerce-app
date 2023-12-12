// controllers/order.controller.ts
import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
    static async createOrder(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id;

        // Extract the authorization header from the incoming request
        const authHeader = req.headers.authorization;

        try {
            const orderData = {
                ...req.body,
                userId: userId
            };
            const order = await OrderService.createOrder(orderData, authHeader);
            res.status(201).json(order);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getOrderById(req: Request, res: Response): Promise<void> {
        try {

            const orderId = parseInt(req.params.id, 10);
            const userId = req.user!.id;

            console.log("User and order IDs: ", userId, orderId);

            const order = await OrderService.getOrderById(userId, orderId);

            if (!order) {
                res.status(404).send('Order not found');
                return;
            }

            res.json(order);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }


}
