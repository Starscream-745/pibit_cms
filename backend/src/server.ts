import express, { Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import database from './config/database';
import assetRoutes from './routes/assetRoutes';
import uploadRoutes from './routes/uploadRoutes';
import authRoutes from './routes/authRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for LAN access
app.use(cors({
  origin: '*', // Allow all origins for LAN access
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
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
app.use('/api', analyticsRoutes);
app.use('/api', userRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

import authService from './services/authService';

// Start server
async function startServer() {
  // 1. Start listening immediately so the frontend can reach the health/status endpoints
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

  try {
    // 2. Connect to database in the background
    console.log('⏳ Connecting to MongoDB...');
    await database.connect();
    
    // 3. Initialize admin user
    await authService.initializeAdmin();
    console.log('✅ Background initialization complete.');

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\nClosing HTTP server');
      server.close(async () => {
        await database.disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Background initialization failed:', error);
    // We don't exit here because the server is already running and serving static/health routes
    // Any DB-dependent routes will handle the error via database.getDb() throwing
  }
}

// Start the server
startServer();

export default app;
