import express, { Request, Response } from 'express';
import { sequelize } from './models'; // Adjust the import path as needed
import productRoutes from './routes/product.routes'; // Adjust the import path as needed

const app = express();

const PORT: string | number = process.env.ORDERS_SERVICE_PORT || 3002;

app.use(express.json());

app.use('/api/v0/products', productRoutes);

app.listen(PORT, async () => {
    console.log(`Product Service listening on port ${PORT}`);
    // Sync Sequelize models
    try {
        await sequelize.sync({ force: true });
        console.log('Database connected at product service!');
    } catch (error) {
        console.error('Unable to connect to the database at product service:', error);
    }
});
