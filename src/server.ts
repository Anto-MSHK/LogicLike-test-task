import dotenv from 'dotenv';
import app from './app';
import { sequelize } from './models';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API available at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

