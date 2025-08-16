const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CryptoCandle AI Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Test stock route
app.get('/api/stocks/test', (req, res) => {
  res.json({ 
    message: 'Stock API is working',
    testData: {
      symbol: 'AAPL',
      price: 150.25,
      change: 2.15
    }
  });
});

// Test crypto route
app.get('/api/crypto/test', (req, res) => {
  res.json({ 
    message: 'Crypto API is working',
    testData: {
      symbol: 'BTC',
      price: 43250.00,
      change: 1250.00
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📊 CryptoCandle AI Backend is ready!`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
