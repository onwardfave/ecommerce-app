// product-service/src/models/index.ts
import { Sequelize, Options } from 'sequelize';

interface ConnectionParams {
    database: string;
    username: string;
    password: string;
    options: Options;
}

// Assert that environment variables are defined or provide fallback values
const connectionParams: ConnectionParams = {
    database: process.env.PRODUCTS_DB_NAME || '',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    options: {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT || '3306'),
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};

console.log('Connection Parameters:', JSON.stringify(connectionParams, null, 2));

const sequelize = new Sequelize(
    connectionParams.database,
    connectionParams.username,
    connectionParams.password,
    connectionParams.options
);

// You might need to adjust the model import paths and methods to work with TypeScript
const modelDefiners: Array<(sequelize: Sequelize) => void> = [
    // Add model definer functions here
    // Example: import user model and then add here
];

modelDefiners.forEach(modelDefiner => modelDefiner(sequelize));

export { sequelize };
