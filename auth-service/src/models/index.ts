import { Sequelize } from 'sequelize-typescript';
import { User } from './user.model';

// You don't need a separate interface for ConnectionParams here
const sequelize = new Sequelize({
    database: process.env.AUTH_DB_NAME,
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

sequelize.addModels([User]);

export { sequelize };
