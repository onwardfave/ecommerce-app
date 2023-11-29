import express, { Request, Response } from 'express';
import { sequelize } from './models'; // Adjust the import path as needed
import productRoutes from './routes/product.routes'; // Adjust the import path as needed

const app = express();
let PORT: number = process.env.PRODUCT_SERVICE_PORT ? parseInt(process.env.PRODUCT_SERVICE_PORT) : null || 3002;

console.log("Port number: ", PORT)

if (PORT == null) {
    PORT = 3002;
}

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
