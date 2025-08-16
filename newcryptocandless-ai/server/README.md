# CryptoCandle AI Backend Server

A powerful Node.js/Express backend server that provides real-time stock and cryptocurrency data, AI-powered market analysis, and user management for the CryptoCandle AI trading platform.

## 🚀 Features

### Real-Time Data Integration
- **Yahoo Finance API** - Live stock data and historical charts
- **CoinGecko API** - Real-time cryptocurrency prices and market data
- **Technical Indicators** - SMA, RSI calculations for analysis

### AI-Powered Analysis
- **OpenAI GPT-3.5 Integration** - Professional market analysis and recommendations
- **Technical Analysis** - Automated calculation of key indicators
- **Market Sentiment** - AI-generated sentiment analysis

### User Management
- **Watchlist Management** - Add/remove stocks and crypto from watchlists
- **Portfolio Tracking** - Track user investments and positions
- **User Profiles** - Basic user account management

### API Endpoints
- **Stocks** - Search, quotes, popular stocks
- **Crypto** - Search, quotes, popular cryptocurrencies, trending
- **AI Analysis** - Market analysis and sentiment
- **Users** - Profile, watchlist, portfolio management

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for API calls
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📦 Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Stocks
- `GET /api/stocks/search/:symbol` - Get stock data and chart data
- `GET /api/stocks/quote/:symbol` - Get current stock quote
- `GET /api/stocks/popular` - Get popular stocks

### Cryptocurrencies
- `GET /api/crypto/search/:symbol` - Get crypto data and chart data
- `GET /api/crypto/quote/:symbol` - Get current crypto quote
- `GET /api/crypto/popular` - Get popular cryptocurrencies
- `GET /api/crypto/trending` - Get trending cryptocurrencies

### AI Analysis
- `POST /api/ai/analyze` - Get AI-powered market analysis
- `GET /api/ai/sentiment/:symbol` - Get market sentiment

### Users
- `GET /api/users/demo` - Get demo user data
- `GET /api/users/profile/:id` - Get user profile
- `GET /api/users/watchlist/:id` - Get user watchlist
- `POST /api/users/watchlist/:id` - Add to watchlist
- `DELETE /api/users/watchlist/:id/:symbol` - Remove from watchlist
- `GET /api/users/portfolio/:id` - Get user portfolio
- `POST /api/users/portfolio/:id` - Add to portfolio

## 🔌 API Integration

### Stock Data Format
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 150.25,
  "change": 2.15,
  "changePercent": 1.45,
  "volume": 45678900,
  "chartData": [...],
  "volumeData": [...]
}
```

### Crypto Data Format
```json
{
  "symbol": "BTC",
  "name": "Bitcoin",
  "price": 43250.00,
  "change": 1250.00,
  "changePercent": 2.98,
  "volume": 98765400,
  "marketCap": 850000000000,
  "chartData": [...],
  "volumeData": [...]
}
```

### AI Analysis Format
```json
{
  "summary": "Market trend analysis...",
  "recommendation": "BUY",
  "rationale": "Technical analysis reasoning...",
  "confidence": 85
}
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set `NODE_ENV=production` in your environment
2. Ensure all environment variables are configured
3. Run `npm start`

### Environment Variables
- `PORT` - Server port (default: 5000)
- `OPENAI_API_KEY` - OpenAI API key for AI analysis
- `NODE_ENV` - Environment (development/production)

## 🔒 Security

- **CORS Configuration** - Properly configured for frontend communication
- **Error Handling** - Comprehensive error handling and logging
- **API Rate Limiting** - Built-in protection against abuse
- **Environment Variables** - Secure API key management

## 📊 Data Sources

### Yahoo Finance
- Real-time stock prices
- Historical OHLC data
- Volume information
- Company information

### CoinGecko
- Live cryptocurrency prices
- Market cap and volume data
- Trending cryptocurrencies
- Historical price data

### OpenAI
- Market analysis and insights
- Technical analysis recommendations
- Sentiment analysis
- Trading recommendations

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure frontend is running on the correct port
   - Check CORS configuration in server.js

2. **API Key Issues**
   - Verify OpenAI API key is valid
   - Check environment variable configuration

3. **Data Not Loading**
   - Check network connectivity
   - Verify API endpoints are accessible
   - Review server logs for errors

### Logs
The server provides detailed logging for debugging:
- API request logs
- Error tracking
- Performance metrics
- Data fetching status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review server logs
- Ensure all dependencies are installed
- Verify environment variables are set correctly

---

**CryptoCandle AI Backend** - Powering the future of trading with AI! 🚀📈
