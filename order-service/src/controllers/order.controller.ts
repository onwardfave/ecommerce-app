// controllers/order.controller.ts
import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
    static async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const order = await OrderService.createOrder(req.body);
            res.status(201).json(order);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getOrderById(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id, 10);
            const order = await OrderService.getOrderById(orderId);

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
