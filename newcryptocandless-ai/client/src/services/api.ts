const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://live-projects33.onrender.com';

// API Service for backend communication
export const apiService = {
  // Stock APIs
  async getStockData(symbol: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/search/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  },

  async getStockQuote(symbol: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/quote/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      throw error;
    }
  },

  async getPopularStocks() {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/popular`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular stocks:', error);
      throw error;
    }
  },

  // Crypto APIs
  async getCryptoData(symbol: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/crypto/search/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      throw error;
    }
  },

  async getCryptoQuote(symbol: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/crypto/quote/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching crypto quote:', error);
      throw error;
    }
  },

  async getPopularCryptos() {
    try {
      const response = await fetch(`${API_BASE_URL}/crypto/popular`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular cryptos:', error);
      throw error;
    }
  },

  async getTrendingCryptos() {
    try {
      const response = await fetch(`${API_BASE_URL}/crypto/trending`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending cryptos:', error);
      throw error;
    }
  },

  // AI Analysis API
  async getAIAnalysis(data: {
    symbol: string;
    type: string;
    chartData: any[];
    price: number;
    change: number;
    changePercent: number;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      throw error;
    }
  },

  async getMarketSentiment(symbol: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/sentiment/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching market sentiment:', error);
      throw error;
    }
  },

  // User APIs
  async getDemoUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/demo`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching demo user:', error);
      throw error;
    }
  },

  async getUserProfile(userId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async getUserWatchlist(userId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/watchlist/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user watchlist:', error);
      throw error;
    }
  },

  async addToWatchlist(userId: number, symbol: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/watchlist/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  async removeFromWatchlist(userId: number, symbol: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/watchlist/${userId}/${symbol}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  },

  async getUserPortfolio(userId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/portfolio/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user portfolio:', error);
      throw error;
    }
  },

  async addToPortfolio(userId: number, symbol: string, shares: number, price: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/portfolio/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, shares, price }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding to portfolio:', error);
      throw error;
    }
  },

  // Search symbol (stocks or crypto)
  async searchSymbol(symbol: string, type: 'stock' | 'crypto') {
    try {
      const endpoint = type === 'stock' ? 'stocks' : 'crypto';
      const response = await fetch(`${API_BASE_URL}/${endpoint}/search/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking backend health:', error);
      throw error;
    }
  },
};

export default apiService;
