// order.service.ts
import { Order } from '../models/order.model';
import { fetchUserById } from '../utils/user.service.client'; // HTTP client or similar to fetch user data
import { fetchProductById } from '../utils/product.service.client'; // HTTP client or similar to fetch product data
import { Op } from 'sequelize'; // Import Op for Sequelize operators


export class OrderService {
    static async createOrder(orderData: any, headers: any): Promise<Order> {
        // Validate user and product before creating an order
        //const user = await fetchUserById(orderData.userId, headers);
        const product = await fetchProductById(orderData.productId);

        //console.log("Fetched user at create order, ", JSON.stringify(user))
        console.log("Fetched product at create order, ", JSON.stringify(product))


        if (!product) {
            throw new Error('Product not found');
        }

        const total = orderData.quantity * product.price;
        console.log("Order data: ", + JSON.stringify(orderData))
        const order = await Order.create({ ...orderData, total });
        return order;
    }

    static async getOrderById(userId: number, orderId: number): Promise<Order | null> {
        const order = await Order.findOne({
            where: {
                id: orderId,
                userId: userId // This condition ensures that the order belongs to the specified user
            }
        });
        return order;
    }

    // Add other service methods as needed...
}