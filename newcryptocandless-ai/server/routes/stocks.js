const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Stocks route working ✅' });
});

// Get stock data from Yahoo Finance
router.get('/search/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`🔍 Searching for stock: ${symbol}`);

    // Yahoo Finance API endpoint
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?interval=1d&range=30d`;
    
    const response = await axios.get(url);
    const data = response.data;

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    // Format data for charts - ensure proper time format for lightweight-charts
    const chartData = timestamps.map((time, index) => ({
      time: Math.floor(time), // Use Unix timestamp directly
      open: quotes.open[index] || 0,
      high: quotes.high[index] || 0,
      low: quotes.low[index] || 0,
      close: quotes.close[index] || 0,
      volume: quotes.volume[index] || 0
    })).filter(item => item.open > 0 && item.close > 0); // Filter out invalid data

    // Get current price and change
    const currentPrice = chartData[chartData.length - 1]?.close || 0;
    const previousPrice = chartData[chartData.length - 2]?.close || currentPrice;
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = ((priceChange / previousPrice) * 100) || 0;

    const stockInfo = {
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(), // You can enhance this with company names
      price: currentPrice,
      change: priceChange,
      changePercent: priceChangePercent,
      volume: chartData[chartData.length - 1]?.volume || 0,
      chartData: chartData,
      volumeData: chartData.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? '#10b981' : '#ef4444'
      }))
    };

    console.log(`✅ Stock data retrieved for ${symbol}: $${currentPrice}`);
    res.json(stockInfo);

  } catch (error) {
    console.error(`❌ Error fetching stock data for ${req.params.symbol}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch stock data',
      message: error.message 
    });
  }
});

// Get stock quote (current price)
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`💰 Getting quote for: ${symbol}`);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?interval=1d&range=2d`;
    
    const response = await axios.get(url);
    const data = response.data;

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const result = data.chart.result[0];
    const quotes = result.indicators.quote[0];
    
    const currentPrice = quotes.close[quotes.close.length - 1] || 0;
    const previousPrice = quotes.close[quotes.close.length - 2] || currentPrice;
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = ((priceChange / previousPrice) * 100) || 0;

    const quote = {
      symbol: symbol.toUpperCase(),
      price: currentPrice,
      change: priceChange,
      changePercent: priceChangePercent,
      volume: quotes.volume[quotes.volume.length - 1] || 0,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Quote retrieved for ${symbol}: $${currentPrice}`);
    res.json(quote);

  } catch (error) {
    console.error(`❌ Error fetching quote for ${req.params.symbol}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch quote',
      message: error.message 
    });
  }
});

// Get popular stocks
router.get('/popular', async (req, res) => {
  try {
    console.log(`📈 Fetching popular stocks`);
    
    const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'];
    const stocks = [];

    for (const symbol of popularSymbols) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
        const response = await axios.get(url);
        const data = response.data;

        if (data.chart && data.chart.result && data.chart.result.length > 0) {
          const result = data.chart.result[0];
          const quotes = result.indicators.quote[0];
          
          const currentPrice = quotes.close[quotes.close.length - 1] || 0;
          const previousPrice = quotes.close[quotes.close.length - 2] || currentPrice;
          const priceChange = currentPrice - previousPrice;
          const priceChangePercent = ((priceChange / previousPrice) * 100) || 0;

          stocks.push({
            symbol: symbol,
            name: symbol, // You can enhance this with company names
            price: currentPrice,
            change: priceChange,
            changePercent: priceChangePercent,
            volume: quotes.volume[quotes.volume.length - 1] || 0
          });
        }
      } catch (error) {
        console.error(`❌ Error fetching ${symbol}:`, error.message);
      }
    }

    console.log(`✅ Popular stocks retrieved: ${stocks.length} stocks`);
    res.json(stocks);

  } catch (error) {
    console.error(`❌ Error fetching popular stocks:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch popular stocks',
      message: error.message 
    });
  }
});



module.exports = router;
