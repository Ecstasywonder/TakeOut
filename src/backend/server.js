const http = require('http');
const app = require('./app');
const {
  sequelize,
  testConnection
} = require('./config/db');
const initializeSocket = require('./socket/socketHandler');
const env = require('./config/env');
const logger = require('./utils/logger');
// Create HTTP server
const server = http.createServer(app);
// Initialize Socket.IO
const io = initializeSocket(server);
// Start server
const PORT = env.PORT;
// Test database connection and sync models
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    // Sync database models (in development)
    if (env.NODE_ENV === 'development') {
      await sequelize.sync({
        alter: true
      });
      logger.info('Database synchronized');
    }
    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};
// Handle unhandled rejections
process.on('unhandledRejection', err => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});
// Start the server
startServer();