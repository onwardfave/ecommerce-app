import express, { Request, Response } from 'express';
import { sequelize } from './models'; // Adjust the import path as needed
import productRoutes from './routes/product.routes'; // Adjust the import path as needed

const app = express();
const PORT: number = process.env.PRODUCT_SERVICE_PORT ? parseInt(process.env.PRODUCT_SERVICE_PORT) : undefined || 3002;

console.log("Port number: ", PORT)
app.use(express.json());

app.get('/api/v0', productRoutes);

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Product Service listening on port ${PORT}`);
    // Sync Sequelize models
    try {
        await sequelize.sync({ force: true });
        console.log('Database connected at product service!');
    } catch (error) {
        console.error('Unable to connect to the database at product service:', error);
    }
});
