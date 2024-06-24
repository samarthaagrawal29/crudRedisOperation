const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info', // Set the default log level
  format: combine(
    label({ label: 'assignment' }),
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' })
  ]
});

module.exports = logger;
