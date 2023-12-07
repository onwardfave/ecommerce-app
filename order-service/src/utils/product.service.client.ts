// utils/productServiceClient.ts
import axios from 'axios';

const PRODUCT_SERVICE_BASE_URL = process.env.PRODUCT_SERVICE_BASE_URL; // Replace with actual Product Service URL

export const fetchProductById = async (productId: number) => {
    try {
        const response = await axios.get(`http://product-service:3002/api/v0/products/${productId}`);
        return response.data; // Assuming the product data is directly in the response
    } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        return null;
    }
};
