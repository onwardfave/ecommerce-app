import { ProductService } from '../src/services/product.service';
import { Product } from '../src/models/product.model';

jest.mock('../src/models/product.model');


describe('ProductService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test for creating a product
    test('createProduct creates a new product', async () => {
        const productData = { name: 'Test Product', price: 100 };
        Product.create = jest.fn().mockResolvedValue(productData);

        const result = await ProductService.createProduct(productData);

        expect(Product.create).toHaveBeenCalledWith(productData);
        expect(result).toEqual(productData);
    });

    // Test for updating a product
    test('updateProduct updates an existing product', async () => {
        const productId = 1;
        const existingProductMock = {
            id: productId,
            version: 1,
            name: 'Original',
            update: jest.fn() // Mock the update function
        };

        Product.findByPk = jest.fn().mockResolvedValue(existingProductMock);

        const updateData = { version: 1, name: 'Updated', price: 20 };

        await ProductService.updateProduct(productId, updateData);

        expect(Product.findByPk).toHaveBeenCalledWith(productId);
        expect(existingProductMock.update).toHaveBeenCalledWith(expect.objectContaining(updateData));
    });

    // Test for getting all products


    // Test for getting all products
    test('getAllProducts returns all products', async () => {
        const products = [{ id: 1, name: 'Product 1', price: 10 }, { id: 2, name: 'Product 2', price: 20 }];
        Product.findAll = jest.fn().mockResolvedValue(products);

        const result = await ProductService.getAllProducts();

        expect(Product.findAll).toHaveBeenCalled();
        expect(result).toEqual(products);
    });

    // Test for getting a product by its ID


    // Test for getting a product by its ID
    test('getProductById returns product with matching ID', async () => {
        const productId = 1;
        const product = { id: productId, name: 'Product 1', price: 10 };
        Product.findByPk = jest.fn().mockResolvedValue(product);

        const result = await ProductService.getProductById(productId);

        expect(Product.findByPk).toHaveBeenCalledWith(productId);
        expect(result).toEqual(product);
    });


    // Test for getting a product with a nonexistent ID
    test('getProductById returns null for nonexistent ID', async () => {
        const productId = 1;
        Product.findByPk = jest.fn().mockResolvedValue(null);

        const result = await ProductService.getProductById(productId);

        expect(Product.findByPk).toHaveBeenCalledWith(productId);
        expect(result).toBeNull();
    });


    // Test for deleting an existing product
    test('deleteProduct deletes existing product', async () => {
        const productId = 1;
        const existingProductMock = {
            id: productId,
            destroy: jest.fn() // Mock the destroy function
        };

        Product.findByPk = jest.fn().mockResolvedValue(existingProductMock);

        const result = await ProductService.deleteProduct(productId);

        expect(Product.findByPk).toHaveBeenCalledWith(productId);
        expect(existingProductMock.destroy).toHaveBeenCalled();
        expect(result).toBe(true);
    });





});
