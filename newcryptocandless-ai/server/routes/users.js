const express = require('express');
const router = express.Router();

// Mock user data (in real app, this would be in a database)
let users = [
  {
    id: 1,
    email: 'demo@cryptocandle.ai',
    name: 'Demo User',
    watchlist: ['AAPL', 'TSLA', 'BTC'],
    portfolio: [
      { symbol: 'AAPL', shares: 10, avgPrice: 150 },
      { symbol: 'TSLA', shares: 5, avgPrice: 250 }
    ]
  }
];

// Get user profile
router.get('/profile/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ User profile retrieved for ID: ${userId}`);
    res.json(user);
  } catch (error) {
    console.error(`❌ Error getting user profile:`, error.message);
    res.status(500).json({ 
      error: 'Failed to get user profile',
      message: error.message 
    });
  }
});

// Get user watchlist
router.get('/watchlist/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Watchlist retrieved for user ID: ${userId}`);
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    console.error(`❌ Error getting watchlist:`, error.message);
    res.status(500).json({ 
      error: 'Failed to get watchlist',
      message: error.message 
    });
  }
});

// Add to watchlist
router.post('/watchlist/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { symbol } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.watchlist.includes(symbol)) {
      user.watchlist.push(symbol);
    }

    console.log(`✅ Added ${symbol} to watchlist for user ID: ${userId}`);
    res.json({ 
      message: `${symbol} added to watchlist`,
      watchlist: user.watchlist 
    });
  } catch (error) {
    console.error(`❌ Error adding to watchlist:`, error.message);
    res.status(500).json({ 
      error: 'Failed to add to watchlist',
      message: error.message 
    });
  }
});

// Remove from watchlist
router.delete('/watchlist/:id/:symbol', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { symbol } = req.params;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.watchlist = user.watchlist.filter(s => s !== symbol);

    console.log(`✅ Removed ${symbol} from watchlist for user ID: ${userId}`);
    res.json({ 
      message: `${symbol} removed from watchlist`,
      watchlist: user.watchlist 
    });
  } catch (error) {
    console.error(`❌ Error removing from watchlist:`, error.message);
    res.status(500).json({ 
      error: 'Failed to remove from watchlist',
      message: error.message 
    });
  }
});

// Get user portfolio
router.get('/portfolio/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Portfolio retrieved for user ID: ${userId}`);
    res.json({ portfolio: user.portfolio });
  } catch (error) {
    console.error(`❌ Error getting portfolio:`, error.message);
    res.status(500).json({ 
      error: 'Failed to get portfolio',
      message: error.message 
    });
  }
});

// Add to portfolio
router.post('/portfolio/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { symbol, shares, price } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingPosition = user.portfolio.find(p => p.symbol === symbol);
    if (existingPosition) {
      // Update existing position
      const totalShares = existingPosition.shares + shares;
      const totalValue = (existingPosition.shares * existingPosition.avgPrice) + (shares * price);
      existingPosition.avgPrice = totalValue / totalShares;
      existingPosition.shares = totalShares;
    } else {
      // Add new position
      user.portfolio.push({ symbol, shares, avgPrice: price });
    }

    console.log(`✅ Added ${shares} shares of ${symbol} to portfolio for user ID: ${userId}`);
    res.json({ 
      message: `${shares} shares of ${symbol} added to portfolio`,
      portfolio: user.portfolio 
    });
  } catch (error) {
    console.error(`❌ Error adding to portfolio:`, error.message);
    res.status(500).json({ 
      error: 'Failed to add to portfolio',
      message: error.message 
    });
  }
});

// Get demo user (for frontend testing)
router.get('/demo', (req, res) => {
  try {
    const demoUser = users[0]; // First user is demo user
    console.log(`✅ Demo user data retrieved`);
    res.json(demoUser);
  } catch (error) {
    console.error(`❌ Error getting demo user:`, error.message);
    res.status(500).json({ 
      error: 'Failed to get demo user',
      message: error.message 
    });
  }
});

// Create new user (simplified)
router.post('/register', (req, res) => {
  try {
    const { email, name } = req.body;
    
    const newUser = {
      id: users.length + 1,
      email,
      name,
      watchlist: [],
      portfolio: []
    };
    
    users.push(newUser);

    console.log(`✅ New user registered: ${email}`);
    res.json({ 
      message: 'User registered successfully',
      user: newUser 
    });
  } catch (error) {
    console.error(`❌ Error registering user:`, error.message);
    res.status(500).json({ 
      error: 'Failed to register user',
      message: error.message 
    });
  }
});

module.exports = router;
