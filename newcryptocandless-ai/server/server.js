const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');

const app = express();
const PORT = config.PORT;

// Middleware
const allowedOrigins = config.CORS_ORIGIN;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/crypto', require('./routes/crypto'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CryptoCandle AI Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Add this above the 404 handler
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Welcome to CryptoCandle AI API 🚀',
    endpoints: [
      '/api/health',
      '/api/stocks',
      '/api/crypto',
      '/api/ai',
      '/api/users'
    ]
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Welcome to CryptoCandle AI Backend 🚀',
    docs: '/api'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 CryptoCandle AI Backend is ready!`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
