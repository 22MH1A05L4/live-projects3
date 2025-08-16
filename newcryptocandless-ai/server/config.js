require('dotenv').config();

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API Keys
  YAHOO_FINANCE_API_KEY: process.env.YAHOO_FINANCE_API_KEY,
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // CORS
   CORS_ORIGIN: [
    process.env.FRONTEND_URL,                // your Vercel frontend
    'http://localhost:3000'                  // local testing
  ],

  
  
  // API Endpoints
  YAHOO_FINANCE_BASE_URL: 'https://query1.finance.yahoo.com',
  COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
  
  // Chart Settings
  DEFAULT_CHART_PERIOD: '30d',
  DEFAULT_CHART_INTERVAL: '1d'
};


