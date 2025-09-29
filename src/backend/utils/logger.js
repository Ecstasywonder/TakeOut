const winston = require('winston');
const env = require('../config/env');
// Define log format
const logFormat = winston.format.printf(({
  level,
  message,
  timestamp,
  ...meta
}) => {
  return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
});
// Create logger
const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), winston.format.errors({
    stack: true
  }), winston.format.splat(), winston.format.json()),
  defaultMeta: {
    service: 'takeout-api'
  },
  transports: [
  // Write all logs to console
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), logFormat)
  })]
});
// Add file transport in production
if (env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 5242880,
    // 5MB
    maxFiles: 5
  }));
  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 5242880,
    // 5MB
    maxFiles: 5
  }));
}
module.exports = logger;