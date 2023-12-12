import express, { Request, Response } from 'express';
import { sequelize } from './models';
import orderRoutes from './routes/order.routes';
import { } from './types/user'

const app = express();
const PORT: string | number = process.env.ORDERS_SERVICE_PORT || 3003;

app.use(express.json());

// Use order routes
app.use('/api/v0/orders', orderRoutes);

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
