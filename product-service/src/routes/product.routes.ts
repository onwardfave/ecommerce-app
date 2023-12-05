import express from 'express';
import { requireAuth } from '../middleware/auth.middleware'; // Adjust the import path as necessary
import {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';

const router = express.Router();

// Applying authMiddleware to protected routes
router.post('/', requireAuth, createProduct);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

// Publicly accessible routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

export default router;
