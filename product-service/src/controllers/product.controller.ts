// product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductService.getAllProducts();
        res.status(200).json(products);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get products', error: error.message });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    try {
        const product = await ProductService.getProductById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json(product);
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to get product', error: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    try {
        const updatedProduct = await ProductService.updateProduct(productId, req.body);
        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json(updatedProduct);
        }
    } catch (error: any) {
        if (error.message === 'Version mismatch. The product has been modified by another process.') {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to update product', error: error.message });
        }
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    try {
        const isDeleted = await ProductService.deleteProduct(productId);
        if (!isDeleted) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(204).send();
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
};
