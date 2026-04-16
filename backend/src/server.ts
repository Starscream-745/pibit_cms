import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './config/database';
import assetRoutes from './routes/assetRoutes';
import uploadRoutes from './routes/uploadRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for LAN access
app.use(cors({
  origin: '*', // Allow all origins for LAN access
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', assetRoutes);
app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to database
    await database.connect();
    
    // Start listening
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('🚀 PIBIT.AI CMS Server Started');
      console.log('================================');
      console.log(`📡 Environment: ${NODE_ENV}`);
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
      console.log(`📦 API: http://localhost:${PORT}/api`);
      console.log('================================');
      console.log('');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        await database.disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\nSIGINT signal received: closing HTTP server');
      server.close(async () => {
        await database.disconnect();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
