import express, { Request, Response } from 'express';
import { sequelize } from './models'; // Adjust the import path as needed

const app = express();
const PORT: string | number = process.env.PRODUCT_SERVICE_PORT || 3002;

app.use(express.json());

app.get('/api/v0/products', (req: Request, res: Response) => {
    res.send('Product Service is running...');
});

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
