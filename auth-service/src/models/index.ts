import { Sequelize, Options } from 'sequelize';

interface ConnectionParams {
    database: string | undefined;
    username: string | undefined;
    password: string | undefined;
    options: Options;
}

const connectionParams: ConnectionParams = {
    database: process.env.AUTH_DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    options: {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT || '3306'), // Default to 3306 if undefined
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}

console.log("Connection params at auth service: " + JSON.stringify(connectionParams));

const sequelize = new Sequelize(
    connectionParams.database || '', // Fallback to default value if undefined
    connectionParams.username || '',
    connectionParams.password || '',
    connectionParams.options
);

const modelDefiners: Array<(sequelize: Sequelize) => void> = [
    // Add model definer functions here
    // Example: import { defineUserModel } from './userModel'; and then add defineUserModel
];

modelDefiners.forEach(modelDefiner => modelDefiner(sequelize));

export { sequelize };
