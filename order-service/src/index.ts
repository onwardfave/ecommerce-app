import express, { Request, Response } from 'express';
import { sequelize } from './models'; // Adjust the import path as needed

const app = express();
const PORT: string | number = process.env.ORDERS_SERVICE_PORT || 3003;

app.use(express.json());

app.get('/api/v0/orders', (req: Request, res: Response) => {
    res.send('Order Service is running...');
});

app.listen(PORT, async () => {
    console.log(`Order Service listening on port ${PORT}`);
    // Sync Sequelize models
    try {
        await sequelize.sync({ force: true });
        console.log('Database connected at order service!');
    } catch (error) {
        console.error('Unable to connect to the database at order service:', error);
    }
});
