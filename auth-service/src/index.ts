import app from './app';
import { sequelize } from './models';
import logger from './utils/logger';

const PORT: string | number = process.env.AUTH_SERVICE_PORT || 3001;


process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

app.listen(PORT, async () => {
    logger.info(`Auth Service listening on port ${PORT}`);
    try {
        await sequelize.sync({ force: true });
        logger.info('Database connected at auth service!');
    } catch (error) {
        logger.error('Unable to connect to the database at auth service:', error);
    }
});
