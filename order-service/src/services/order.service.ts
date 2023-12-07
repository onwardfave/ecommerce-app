// order.service.ts
import { Order } from '../models/order.model';
import { fetchUserById } from '../utils/user.service.client'; // HTTP client or similar to fetch user data
import { fetchProductById } from '../utils/product.service.client'; // HTTP client or similar to fetch product data

export class OrderService {
    static async createOrder(orderData: any): Promise<Order> {
        // Validate user and product before creating an order
        const user = await fetchUserById(orderData.userId);
        const product = await fetchProductById(orderData.productId);

        console.log("Fetched user at create order, ", JSON.stringify(user))
        console.log("Fetched product at create order, ", JSON.stringify(product))


        if (!user || !product) {
            throw new Error('User or Product not found');
        }

        const total = orderData.quantity * product.price;
        const order = await Order.create({ ...orderData, total });
        return order;
    }

    static async getOrderById(orderId: number): Promise<Order | null> {
        const order = await Order.findByPk(orderId);
        return order;
    }

    // Add other service methods as needed...
}
