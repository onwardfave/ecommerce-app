import * as winston from 'winston'

const logger = winston.createLogger({
    level: 'info', // default logging level
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
        // Add other transports here, like file transport for saving logs to a file
    ]
});

export default logger;

