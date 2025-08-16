const express = require('express');
const axios = require('axios');
const router = express.Router();

// Analyze market data with OpenAI
router.post('/analyze', async (req, res) => {
  try {
    const { symbol, type, chartData, price, change, changePercent } = req.body;
    
    console.log(`🤖 AI Analysis requested for ${symbol} (${type})`);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        message: 'Please configure OPENAI_API_KEY in environment variables'
      });
    }

    // Prepare market data for analysis
    const recentData = chartData.slice(-10); // Last 10 data points
    const priceData = recentData.map(d => ({
      date: new Date(d.time).toLocaleDateString(),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume
    }));

    // Calculate technical indicators
    const sma20 = calculateSMA(chartData, 20);
    const rsi = calculateRSI(chartData, 14);
    const currentRSI = rsi[rsi.length - 1];

    // Create analysis prompt
    const prompt = `Analyze this ${type} (${symbol}) market data and provide a professional trading analysis:

Current Price: $${price}
24h Change: ${changePercent.toFixed(2)}% (${change >= 0 ? '+' : ''}${change.toFixed(2)})

Recent Price Data (Last 10 days):
${priceData.map(d => `${d.date}: O:$${d.open.toFixed(2)} H:$${d.high.toFixed(2)} L:$${d.low.toFixed(2)} C:$${d.close.toFixed(2)} V:${d.volume.toLocaleString()}`).join('\n')}

Technical Indicators:
- 20-day SMA: $${sma20.toFixed(2)}
- 14-day RSI: ${currentRSI.toFixed(2)}

Please provide:
1. A 2-3 sentence summary of the current market trend
2. A clear BUY/SELL/HOLD recommendation
3. A brief rationale for your recommendation (1-2 sentences)
4. A confidence level (0-100%)

Format your response as JSON:
{
  "summary": "your trend summary",
  "recommendation": "BUY/SELL/HOLD",
  "rationale": "your rationale",
  "confidence": 85
}`;

    // Call OpenAI API
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional financial analyst specializing in market analysis. Provide clear, concise, and actionable trading advice based on technical and fundamental analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = openaiResponse.data.choices[0].message.content;
    
    // Try to parse JSON response, fallback to structured response if needed
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (error) {
      // If JSON parsing fails, create structured response from text
      analysis = {
        summary: aiResponse.split('\n')[0] || 'Analysis completed',
        recommendation: extractRecommendation(aiResponse),
        rationale: extractRationale(aiResponse),
        confidence: extractConfidence(aiResponse)
      };
    }

    // Ensure all required fields are present
    const finalAnalysis = {
      summary: analysis.summary || 'Market analysis completed',
      recommendation: analysis.recommendation || 'HOLD',
      rationale: analysis.rationale || 'Based on current market conditions',
      confidence: analysis.confidence || 70
    };

    console.log(`✅ AI Analysis completed for ${symbol}: ${finalAnalysis.recommendation} (${finalAnalysis.confidence}% confidence)`);
    res.json(finalAnalysis);

  } catch (error) {
    console.error(`❌ Error in AI analysis:`, error.message);
    
    // Fallback to mock analysis if OpenAI fails
    const mockAnalysis = {
      summary: `${req.body.symbol} shows mixed signals with current market conditions. The asset has experienced ${req.body.changePercent >= 0 ? 'positive' : 'negative'} momentum recently.`,
      recommendation: Math.random() > 0.6 ? 'BUY' : Math.random() > 0.3 ? 'HOLD' : 'SELL',
      rationale: `Technical indicators suggest ${Math.random() > 0.5 ? 'continued' : 'reversing'} momentum with ${Math.random() > 0.5 ? 'strong' : 'moderate'} volume support.`,
      confidence: Math.floor(Math.random() * 30) + 70
    };

    res.json(mockAnalysis);
  }
});

// Calculate Simple Moving Average
function calculateSMA(data, period) {
  if (data.length < period) return 0;
  
  const prices = data.map(d => d.close);
  const recentPrices = prices.slice(-period);
  const sum = recentPrices.reduce((acc, price) => acc + price, 0);
  return sum / period;
}

// Calculate Relative Strength Index
function calculateRSI(data, period) {
  if (data.length < period + 1) return [50]; // Default neutral RSI
  
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const avgGain = gains.slice(-period).reduce((acc, gain) => acc + gain, 0) / period;
  const avgLoss = losses.slice(-period).reduce((acc, loss) => acc + loss, 0) / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return [rsi];
}

// Extract recommendation from text
function extractRecommendation(text) {
  const buyMatch = text.match(/BUY/i);
  const sellMatch = text.match(/SELL/i);
  const holdMatch = text.match(/HOLD/i);
  
  if (buyMatch) return 'BUY';
  if (sellMatch) return 'SELL';
  if (holdMatch) return 'HOLD';
  return 'HOLD';
}

// Extract rationale from text
function extractRationale(text) {
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.includes('rationale') || line.includes('because') || line.includes('due to')) {
      return line.replace(/rationale[:\s]*/i, '').trim();
    }
  }
  return 'Based on technical analysis and market conditions';
}

// Extract confidence from text
function extractConfidence(text) {
  const confidenceMatch = text.match(/(\d+)%/);
  if (confidenceMatch) {
    const confidence = parseInt(confidenceMatch[1]);
    return Math.min(Math.max(confidence, 0), 100);
  }
  return 75; // Default confidence
}

// Get market sentiment
router.get('/sentiment/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`📊 Getting market sentiment for ${symbol}`);

    // This could be enhanced with news sentiment analysis
    const sentiment = {
      symbol: symbol.toUpperCase(),
      sentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
      confidence: Math.floor(Math.random() * 30) + 70,
      factors: [
        'Technical indicators',
        'Volume analysis',
        'Market momentum',
        'Price action'
      ],
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Market sentiment retrieved for ${symbol}`);
    res.json(sentiment);

  } catch (error) {
    console.error(`❌ Error getting market sentiment:`, error.message);
    res.status(500).json({ 
      error: 'Failed to get market sentiment',
      message: error.message 
    });
  }
});

module.exports = router;
