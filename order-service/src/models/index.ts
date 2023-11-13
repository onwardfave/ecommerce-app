// auth-service/src/models/index.ts
import { Sequelize, Options } from 'sequelize';

// Define the options with the appropriate type
const sequelizeOptions: Options = {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT || '3306'), // Ensure the port is a number
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// Initialize Sequelize with environment variables
// Make sure to handle the possibility of undefined values in a real application
const sequelize = new Sequelize(
    process.env.ORDERS_DB_NAME || '',
    process.env.DB_USER || '',
    process.env.DB_PASS || '',
    sequelizeOptions
);

// Define your modelDefiners
const modelDefiners: Array<(sequelize: Sequelize) => void> = [
    // Example: require('./userModel')(sequelize),
    // You can import and add your model definers here
];

// Invoke all model definers
modelDefiners.forEach(definer => definer(sequelize));

export { sequelize };
