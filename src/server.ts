import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app';
import { sequelize } from './models';
import { initializeSocket } from './socket';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    const httpServer = createServer(app);
    
    initializeSocket(httpServer);
    console.log('✓ Socket.IO initialized');

    httpServer.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API available at: http://localhost:${PORT}`);
      console.log(`✓ WebSocket available at: ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

