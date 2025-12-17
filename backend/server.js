const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const productsRoutes = require('./routes/products');
const availabilityRoutes = require('./routes/availability');
const bookingsRoutes = require('./routes/bookings');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost origins
    if (process.env.NODE_ENV === 'development') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }
    
    // Check against allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Compression middleware
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'RelAcksation Backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    paymentMode: process.env.PAYMENT_MODE || 'OFFLINE_CONTACT'
  });
});

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// API routes
app.use('/api', productsRoutes);
app.use('/api', availabilityRoutes);
app.use('/api', bookingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    console.log('[RelAcksation] Booting backend...');
    
    // Connect to MongoDB with timeout
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`[RelAcksation] Listening on http://localhost:${PORT}`);
      console.log(`[RelAcksation] Health check: http://localhost:${PORT}/api/health`);
      console.log(`💳 Payment Mode: ${process.env.PAYMENT_MODE || 'OFFLINE_CONTACT'}`);
    });
    
  } catch (error) {
    console.error('[RelAcksation] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[RelAcksation] SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('[RelAcksation] MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[RelAcksation] SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('[RelAcksation] MongoDB connection closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[RelAcksation] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[RelAcksation] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});