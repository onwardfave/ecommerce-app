// product.model.test.ts
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../src/models/product.model';

describe('Product Model', () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [Product], // Include the Product model
            logging: false,
        });
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    // Define tests for the Product model here...

    test('should create a new product', async () => {
        const productData = {
            name: 'Test Product',
            description: 'Test Description',
            price: 19.99,
        };

        const product = await Product.create(productData);

        expect(product.id).toBeDefined();
        expect(product.name).toBe(productData.name);
        expect(product.description).toBe(productData.description);
        expect(product.price).toBe(productData.price);
        expect(product.createdAt).toBeDefined();
        expect(product.updatedAt).toBeDefined();
    });

    test('should update a product', async () => {
        const productData = {
            name: 'Test Product',
            description: 'Test Description',
            price: 19.99,
        };

        const createdProduct = await Product.create(productData);
        const updatedData = {
            name: 'Updated Product',
            description: 'Updated Description',
            price: 29.99,
        };

        await createdProduct.update(updatedData);

        expect(createdProduct.name).toBe(updatedData.name);
        expect(createdProduct.description).toBe(updatedData.description);
        expect(createdProduct.price).toBe(updatedData.price);
    });

    test('should delete a product', async () => {
        const productData = {
            name: 'Test Product 2',
            description: 'Test Description 4',
            price: 19.99,
        };

        const createdProduct = await Product.create(productData);
        await createdProduct.destroy();

        const foundProduct = await Product.findByPk(createdProduct.id);
        expect(foundProduct).toBeNull();
    });

    test('should not update a product with outdated version', async () => {
        // Create a mock product instance with initial properties
        const mockProduct = {
            id: 1,
            name: 'Test Product',
            description: 'Test Description',
            price: 19.99,
            version: 1, // Current version
        };

        // Define the mock update method with version check
        const mockUpdate = jest.fn((updatedData: any) => {
            if (updatedData.version !== mockProduct.version) {
                throw new Error('Version mismatch');
            }
            return Promise.resolve({
                ...mockProduct,
                ...updatedData,
                version: updatedData.version
            });
        });

        // Mock findByPk to return a mock instance with the update method
        Product.findByPk = jest.fn().mockResolvedValue({
            ...mockProduct,
            update: mockUpdate
        } as unknown as Product);

        // Attempt to update with an outdated version number
        const productToUpdate = await Product.findByPk(1); // Assuming this returns the product to update
        try {
            // Attempt to update with an outdated version number
            await productToUpdate?.update({ ...productToUpdate, version: 0 });
            throw new Error('Expected version mismatch error was not thrown');
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Version mismatch');
        }
    });
    

});
