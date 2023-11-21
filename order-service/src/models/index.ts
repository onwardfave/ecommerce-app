import { Sequelize } from 'sequelize-typescript';
import { Order } from './order.model';

const sequelize = new Sequelize({
    database: process.env.ORDERS_DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT || '3306'),
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.addModels([Order]);

export { sequelize };
