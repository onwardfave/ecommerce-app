import express from 'express';
import { requireAuth, authorizeAdmin } from '../middleware/auth.middleware'; // Adjust the import path as necessary
import {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';

const router = express.Router();

// Applying authMiddleware to protected routes
router.post('/', authorizeAdmin, createProduct);
router.put('/:id', authorizeAdmin, updateProduct);
router.delete('/:id', authorizeAdmin, deleteProduct);

// Publicly accessible routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

export default router;
