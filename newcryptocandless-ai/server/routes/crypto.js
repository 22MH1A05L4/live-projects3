const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'crypto route working ✅' });
});

// Get crypto data from CoinGecko
router.get('/search/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`🔍 Searching for crypto: ${symbol}`);

    // First, get the coin ID from the symbol
    const searchUrl = `https://api.coingecko.com/api/v3/search?query=${symbol.toLowerCase()}`;
    const searchResponse = await axios.get(searchUrl);
    const searchData = searchResponse.data;

    if (!searchData.coins || searchData.coins.length === 0) {
      return res.status(404).json({ error: 'Cryptocurrency not found' });
    }

    // Get the first matching coin
    const coin = searchData.coins[0];
    const coinId = coin.id;

    // Get detailed data for the coin
    const detailUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`;
    const detailResponse = await axios.get(detailUrl);
    const detailData = detailResponse.data;

    // Format data for charts - ensure proper time format for lightweight-charts
    const chartData = detailData.prices.map((price, index) => {
      const volume = detailData.total_volumes[index] ? detailData.total_volumes[index][1] : 0;
      const marketCap = detailData.market_caps[index] ? detailData.market_caps[index][1] : 0;
      
      // Calculate OHLC from daily data (simplified)
      const open = index > 0 ? detailData.prices[index - 1][1] : price[1];
      const close = price[1];
      const high = Math.max(open, close) * 1.02; // Approximate high
      const low = Math.min(open, close) * 0.98; // Approximate low

      return {
        time: Math.floor(price[0] / 1000), // Convert to Unix timestamp
        open: open,
        high: high,
        low: low,
        close: close,
        volume: volume
      };
    });

    // Get current price and change
    const currentPrice = chartData[chartData.length - 1]?.close || 0;
    const previousPrice = chartData[chartData.length - 2]?.close || currentPrice;
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = ((priceChange / previousPrice) * 100) || 0;

    const cryptoInfo = {
      symbol: symbol.toUpperCase(),
      name: coin.name,
      price: currentPrice,
      change: priceChange,
      changePercent: priceChangePercent,
      volume: chartData[chartData.length - 1]?.volume || 0,
      marketCap: detailData.market_caps[detailData.market_caps.length - 1]?.[1] || 0,
      chartData: chartData,
      volumeData: chartData.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? '#10b981' : '#ef4444'
      }))
    };

    console.log(`✅ Crypto data retrieved for ${symbol}: $${currentPrice}`);
    res.json(cryptoInfo);

  } catch (error) {
    console.error(`❌ Error fetching crypto data for ${req.params.symbol}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch crypto data',
      message: error.message 
    });
  }
});

// Get crypto quote (current price)
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`💰 Getting crypto quote for: ${symbol}`);

    // Get current price from CoinGecko
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
    
    const response = await axios.get(url);
    const data = response.data;

    if (!data[symbol.toLowerCase()]) {
      return res.status(404).json({ error: 'Cryptocurrency not found' });
    }

    const coinData = data[symbol.toLowerCase()];
    const quote = {
      symbol: symbol.toUpperCase(),
      price: coinData.usd,
      changePercent: coinData.usd_24h_change || 0,
      change: (coinData.usd * (coinData.usd_24h_change / 100)) || 0,
      volume: coinData.usd_24h_vol || 0,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Crypto quote retrieved for ${symbol}: $${coinData.usd}`);
    res.json(quote);

  } catch (error) {
    console.error(`❌ Error fetching crypto quote for ${req.params.symbol}:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch crypto quote',
      message: error.message 
    });
  }
});

// Get popular cryptocurrencies
router.get('/popular', async (req, res) => {
  try {
    console.log(`📈 Fetching popular cryptocurrencies`);
    
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
    const response = await axios.get(url);
    const data = response.data;

    const cryptos = data.map(coin => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      volume: coin.total_volume,
      marketCap: coin.market_cap,
      image: coin.image
    }));

    console.log(`✅ Popular cryptocurrencies retrieved: ${cryptos.length} coins`);
    res.json(cryptos);

  } catch (error) {
    console.error(`❌ Error fetching popular cryptocurrencies:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch popular cryptocurrencies',
      message: error.message 
    });
  }
});

// Get trending cryptocurrencies
router.get('/trending', async (req, res) => {
  try {
    console.log(`🔥 Fetching trending cryptocurrencies`);
    
    const url = 'https://api.coingecko.com/api/v3/search/trending';
    const response = await axios.get(url);
    const data = response.data;

    const trending = data.coins.map(coin => ({
      symbol: coin.item.symbol.toUpperCase(),
      name: coin.item.name,
      price: coin.item.price_btc,
      marketCap: coin.item.market_cap_rank,
      image: coin.item.small,
      score: coin.item.score
    }));

    console.log(`✅ Trending cryptocurrencies retrieved: ${trending.length} coins`);
    res.json(trending);

  } catch (error) {
    console.error(`❌ Error fetching trending cryptocurrencies:`, error.message);
    res.status(500).json({ 
      error: 'Failed to fetch trending cryptocurrencies',
      message: error.message 
    });
  }
});



module.exports = router;
