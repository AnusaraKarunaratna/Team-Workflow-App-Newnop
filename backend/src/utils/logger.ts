import winston from 'winston';

// Always log to the console
const transports = [
  new winston.transports.Console()
];

// Only write to physical files if we are running locally
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: transports
});

export { logger }
