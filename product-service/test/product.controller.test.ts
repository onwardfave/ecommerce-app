import * as ProductController from '../src/controllers/product.controller';
import { ProductService } from '../src/services/product.service';
import { Request, Response } from 'express';

jest.mock('../src/services/product.service');

describe('ProductController', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
    });

    // Test for createProduct
    test('createProduct should create a product and return 201 status', async () => {
        mockReq.body = { name: 'New Product', price: 100 };
        const createdProduct = { id: 1, ...mockReq.body };

        ProductService.createProduct = jest.fn().mockResolvedValue(createdProduct);

        await ProductController.createProduct(mockReq as Request, mockRes as Response);

        expect(ProductService.createProduct).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(createdProduct);
    });

    // Test if the getAllProducts function returns an array of products and returns a 200 status code.


    // Test for getAllProducts
    test('getAllProducts should return an array of products and return 200 status', async () => {
        const products = [{ id: 1, name: 'Product 1', price: 100 }, { id: 2, name: 'Product 2', price: 200 }];

        ProductService.getAllProducts = jest.fn().mockResolvedValue(products);

        await ProductController.getAllProducts(mockReq as Request, mockRes as Response);

        expect(ProductService.getAllProducts).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(products);
    });

    // Test if the getProduct function returns a product and returns a 200 status code.


    // Test for getProduct
    test('getProduct should return a product and return 200 status', async () => {
        const productId = 1;
        const product = { id: productId, name: 'Product 1', price: 100 };

        ProductService.getProductById = jest.fn().mockResolvedValue(product);

        mockReq.params = { id: productId.toString() };

        await ProductController.getProduct(mockReq as Request, mockRes as Response);

        expect(ProductService.getProductById).toHaveBeenCalledWith(productId);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(product);
    });

    // Test if the getProduct function returns a 404 status code if the requested product does not exist.


    // Test for getProduct
    test('getProduct should return a 404 status if the product does not exist', async () => {
        const productId = 1;

        ProductService.getProductById = jest.fn().mockResolvedValue(null);

        mockReq.params = { id: productId.toString() };

        await ProductController.getProduct(mockReq as Request, mockRes as Response);

        expect(ProductService.getProductById).toHaveBeenCalledWith(productId);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    // Test if the updateProduct function updates a product and returns a 200 status code.


    // Test for updateProduct
    test('updateProduct should update a product and return 200 status', async () => {
        const productId = 1;
        const updatedProduct = { id: productId, name: 'Updated Product', price: 200 };

        ProductService.updateProduct = jest.fn().mockResolvedValue(updatedProduct);

        mockReq.params = { id: productId.toString() };
        mockReq.body = { name: 'Updated Product', price: 200 };

        await ProductController.updateProduct(mockReq as Request, mockRes as Response);

        expect(ProductService.updateProduct).toHaveBeenCalledWith(productId, mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(updatedProduct);
    });

    // Test if the updateProduct function returns a 404 status code if the product to be updated does not exist.


    // Test for updateProduct
    test('updateProduct should return a 404 status if the product does not exist', async () => {
        const productId = 1;

        ProductService.updateProduct = jest.fn().mockResolvedValue(null);

        mockReq.params = { id: productId.toString() };

        await ProductController.updateProduct(mockReq as Request, mockRes as Response);

        expect(ProductService.updateProduct).toHaveBeenCalledWith(productId, mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    // Test if the updateProduct function returns a 409 status code if there is a version mismatch.


    // Test for updateProduct
    test('updateProduct should return a 409 status if there is a version mismatch', async () => {
        const productId = 1;
        const updatedProduct = { id: productId, name: 'Updated Product', price: 200 };

        ProductService.updateProduct = jest.fn().mockRejectedValue(new Error('Version mismatch. The product has been modified by another process.'));

        mockReq.params = { id: productId.toString() };
        mockReq.body = { name: 'Updated Product', price: 200 };

        await ProductController.updateProduct(mockReq as Request, mockRes as Response);

        expect(ProductService.updateProduct).toHaveBeenCalledWith(productId, mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Version mismatch. The product has been modified by another process.' });
    });

    // Test if the deleteProduct function successfully deletes a product and returns a 204 status code.


    // Test for deleteProduct
    test('deleteProduct should delete a product and return a 204 status', async () => {
        const productId = 1;

        ProductService.deleteProduct = jest.fn().mockResolvedValue(true);

        mockReq.params = { id: productId.toString() };

        await ProductController.deleteProduct(mockReq as Request, mockRes as Response);

        expect(ProductService.deleteProduct).toHaveBeenCalledWith(productId);
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalled();
    });

    // Test if the deleteProduct function returns a 404 status code if the product to be deleted does not exist.


    // Test for deleteProduct
    test('deleteProduct should return a 404 status if the product to be deleted does not exist', async () => {
        const productId = 1;

        ProductService.deleteProduct = jest.fn().mockResolvedValue(false);

        mockReq.params = { id: productId.toString() };

        await ProductController.deleteProduct(mockReq as Request, mockRes as Response);

        expect(ProductService.deleteProduct).toHaveBeenCalledWith(productId);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

});
