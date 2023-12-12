import { Request, Response } from 'express';
import { OrderController } from '../src/controllers/order.controller';
import { OrderService } from '../src/services/order.service';

jest.mock('../src/services/order.service'); // Mock the OrderService

describe('OrderController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;

    beforeEach(() => {
        responseJson = jest.fn();
        mockRequest = {};
        mockResponse = {
            json: responseJson,
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });

    describe('createOrder', () => {
        const mockOrderData = {
            userId: 1,
            productId: 2,
            total: 150.00,
            orderDate: new Date()
        };

        const mockOrderResponse = {
            id: 123, // assuming an auto-incremented ID
            ...mockOrderData
        };

        it('should create an order and return 201 status', async () => {
            mockRequest.body = mockOrderData;
            mockRequest.headers = { authorization: 'Bearer mock-token' }; // Set the mock authorization header
            mockRequest.user = { id: 1, role: 'mock-role' }; // Mock user object with required properties

            OrderService.createOrder = jest.fn().mockResolvedValue(mockOrderResponse);

            await OrderController.createOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(mockOrderResponse);
        });


        it('should handle errors and return 400 status', async () => {
            mockRequest.body = mockOrderData;
            mockRequest.headers = { authorization: 'Bearer mock-token' }; // Set the mock authorization header
            mockRequest.user = { id: 1, role: 'mock-role' }; // Mock user object with required properties

            OrderService.createOrder = jest.fn().mockRejectedValue(new Error('Failed to create order'));

            await OrderController.createOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Failed to create order' });
        });

    });

    describe('getOrderById', () => {
        const orderId = 123;
        const mockOrderResponse = {
            id: orderId,
            userId: 1,
            productId: 2,
            total: 150.00,
            orderDate: new Date()
        };

        beforeEach(() => {
            // Mock user object for each test
            mockRequest.user = { id: 1, role: 'mock-role' };
        });

        it('should retrieve an order and return it', async () => {
            mockRequest.params = { id: orderId.toString() };
            OrderService.getOrderById = jest.fn().mockResolvedValue(mockOrderResponse);

            await OrderController.getOrderById(mockRequest as Request, mockResponse as Response);

            expect(responseJson).toHaveBeenCalledWith(mockOrderResponse);
        });

        it('should return 404 if order not found', async () => {
            mockRequest.params = { id: orderId.toString() };
            OrderService.getOrderById = jest.fn().mockResolvedValue(null);

            await OrderController.getOrderById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith('Order not found');
        });

        it('should handle errors and return 500 status', async () => {
            mockRequest.params = { id: orderId.toString() };
            OrderService.getOrderById = jest.fn().mockRejectedValue(new Error('Internal server error'));

            await OrderController.getOrderById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

});
