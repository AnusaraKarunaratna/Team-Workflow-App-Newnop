import winston from 'winston';

// FIX: Explicitly type the array as generic winston transports
const transports: winston.transport[] = [
  new winston.transports.Console()
];

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
});// (Or export default logger; depending on what you used in the last step)

export default logger;
