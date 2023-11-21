// product.routes.ts
import express from 'express';
import {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';

const router = express.Router();

router.post('/products', createProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
