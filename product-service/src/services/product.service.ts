// product.service.ts
import { Product } from '../models/product.model';

export class ProductService {
    static async createProduct(productData: any): Promise<Product> {
        const product = await Product.create(productData);
        return product;
    }

    static async getAllProducts(): Promise<Product[]> {
        const products = await Product.findAll();
        return products;
    }

    static async getProductById(productId: number): Promise<Product | null> {
        const product = await Product.findByPk(productId);
        return product;
    }

    static async updateProduct(productId: number, productData: any): Promise<Product | null> {
        const product = await Product.findByPk(productId);
        if (!product) return null;

        // Check for version mismatch
        if (productData.version !== product.version) {
            throw new Error('Version mismatch. The product has been modified by another process.');
        }

        // Increment the version before updating
        productData.version = product.version + 1;

        await product.update(productData);
        return product;
    }

    static async deleteProduct(productId: number): Promise<boolean> {
        const product = await Product.findByPk(productId);
        if (!product) return false;

        await product.destroy();
        return true;
    }
}
