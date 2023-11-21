import { Sequelize } from 'sequelize-typescript';
import { Order } from '../src/models/order.model'
import { OrderService } from '../src/services/order.service';
import mockAxios from 'jest-mock-axios';

// Mocks at the top of your test file
jest.mock('../src/utils/user.service.client');
jest.mock('../src/utils/product.service.client');

import { fetchUserById } from '../src/utils/user.service.client';
import { fetchProductById } from '../src/utils/product.service.client';

describe('Order Service', () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [Order],
            logging: false,
        });
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
        mockAxios.reset();
    });

    test('create order successfully', async () => {
        // Cast to jest.Mock to provide access to mockResolvedValue
        (fetchUserById as jest.Mock).mockResolvedValue({ id: 1, name: 'John Doe' });
        (fetchProductById as jest.Mock).mockResolvedValue({ id: 1, name: 'Widget', price: 10.00 });

        const orderData = { userId: 1, productId: 1, quantity: 2 };
        const order = await OrderService.createOrder(orderData);

        expect(fetchUserById).toHaveBeenCalledWith(1);
        expect(fetchProductById).toHaveBeenCalledWith(1);
        expect(order).toBeDefined();
        expect(order.total).toBe(20.00); // quantity 2 * price 10.00
    });

    // Creates an order successfully with invalid user ID


    test('create order successfully with invalid user ID', async () => {
        // Cast to jest.Mock to provide access to mockResolvedValue
        (fetchUserById as jest.Mock).mockResolvedValue(null);
        (fetchProductById as jest.Mock).mockResolvedValue({ id: 1, name: 'Widget', price: 10.00 });

        const orderData = { userId: 999, productId: 1, quantity: 2 };
        await expect(OrderService.createOrder(orderData)).rejects.toThrow('User or Product not found');

        expect(fetchUserById).toHaveBeenCalledWith(999);
        expect(fetchProductById).toHaveBeenCalledWith(1);
    });

    // Creates an order successfully with invalid product ID


    test('create order successfully with invalid product ID', async () => {
        // Mock the user fetch function to return a valid user
        (fetchUserById as jest.Mock).mockResolvedValue({ id: 1, name: 'John Doe' });

        // Mock the product fetch function to return null (invalid product ID)
        (fetchProductById as jest.Mock).mockResolvedValue(null);

        const orderData = { userId: 1, productId: 999, quantity: 2 };
        await expect(OrderService.createOrder(orderData)).rejects.toThrow('User or Product not found');

        expect(fetchUserById).toHaveBeenCalledWith(1);
        expect(fetchProductById).toHaveBeenCalledWith(999);
    });


    // Returns null when getting an order by invalid ID


    test('returns null when getting an order by invalid ID', async () => {
        const invalidOrderId = 999;
        const order = await OrderService.getOrderById(invalidOrderId);

        expect(order).toBeNull();
    });


    // Throws an error when user is not found during order creation
    test('throws an error when user is not found during order creation', async () => {
        // Mock the user fetch function to return null (invalid user ID)
        (fetchUserById as jest.Mock).mockResolvedValue(null);

        // Mock the product fetch function to return a valid product
        (fetchProductById as jest.Mock).mockResolvedValue({ id: 1, name: 'Widget', price: 10.00 });

        const orderData = { userId: 999, productId: 1, quantity: 2 };
        await expect(OrderService.createOrder(orderData)).rejects.toThrow('User or Product not found');

        expect(fetchUserById).toHaveBeenCalledWith(999);
        expect(fetchProductById).toHaveBeenCalledWith(1);
    });

});
