import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  Trash2,
  History,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
  status: 'pending' | 'filled' | 'cancelled';
}

interface Position {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

interface PaperTradingProps {
  onPortfolioChange: (portfolio: Position[]) => void;
}

const PaperTrading: React.FC<PaperTradingProps> = ({ onPortfolioChange }) => {
  const [balance, setBalance] = useState(100000); // Start with $100k
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    type: 'buy' as 'buy' | 'sell',
    shares: 0,
    price: 0
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('cryptocandle-paper-balance');
    const savedPositions = localStorage.getItem('cryptocandle-paper-positions');
    const savedTrades = localStorage.getItem('cryptocandle-paper-trades');

    if (savedBalance) setBalance(parseFloat(savedBalance));
    if (savedPositions) {
      const parsedPositions = JSON.parse(savedPositions);
      setPositions(parsedPositions);
      onPortfolioChange(parsedPositions);
    }
    if (savedTrades) setTrades(JSON.parse(savedTrades));
  }, [onPortfolioChange]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cryptocandle-paper-balance', balance.toString());
    localStorage.setItem('cryptocandle-paper-positions', JSON.stringify(positions));
    localStorage.setItem('cryptocandle-paper-trades', JSON.stringify(trades));
  }, [balance, positions, trades]);

  const executeTrade = () => {
    if (!tradeForm.symbol || tradeForm.shares <= 0 || tradeForm.price <= 0) {
      alert('Please fill all fields correctly');
      return;
    }

    const total = tradeForm.shares * tradeForm.price;
    
    if (tradeForm.type === 'buy') {
      if (total > balance) {
        alert('Insufficient funds for this trade');
        return;
      }
      
      // Update balance
      setBalance(prev => prev - total);
      
      // Update or create position
      const existingPosition = positions.find(p => p.symbol === tradeForm.symbol);
      if (existingPosition) {
        const newShares = existingPosition.shares + tradeForm.shares;
        const newAvgPrice = ((existingPosition.shares * existingPosition.avgPrice) + total) / newShares;
        
        setPositions(prev => prev.map(p => 
          p.symbol === tradeForm.symbol 
            ? { ...p, shares: newShares, avgPrice: newAvgPrice }
            : p
        ));
      } else {
        const newPosition: Position = {
          symbol: tradeForm.symbol,
          shares: tradeForm.shares,
          avgPrice: tradeForm.price,
          currentPrice: tradeForm.price,
          totalValue: total,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0
        };
        setPositions(prev => [...prev, newPosition]);
      }
    } else { // sell
      const existingPosition = positions.find(p => p.symbol === tradeForm.symbol);
      if (!existingPosition || existingPosition.shares < tradeForm.shares) {
        alert('Insufficient shares to sell');
        return;
      }
      
      // Update balance
      setBalance(prev => prev + total);
      
      // Update position
      const newShares = existingPosition.shares - tradeForm.shares;
      if (newShares === 0) {
        setPositions(prev => prev.filter(p => p.symbol !== tradeForm.symbol));
      } else {
        setPositions(prev => prev.map(p => 
          p.symbol === tradeForm.symbol 
            ? { ...p, shares: newShares }
            : p
        ));
      }
    }

    // Add trade to history
    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: tradeForm.symbol.toUpperCase(),
      type: tradeForm.type,
      shares: tradeForm.shares,
      price: tradeForm.price,
      total: total,
      timestamp: new Date().toISOString(),
      status: 'filled'
    };
    
    setTrades(prev => [newTrade, ...prev]);
    
    // Reset form
    setTradeForm({ symbol: '', type: 'buy', shares: 0, price: 0 });
    setIsTrading(false);
  };

  const cancelTrade = (tradeId: string) => {
    setTrades(prev => prev.map(t => 
      t.id === tradeId ? { ...t, status: 'cancelled' } : t
    ));
  };

  const resetAccount = () => {
    if (window.confirm('Are you sure you want to reset your paper trading account? This will clear all positions and trades.')) {
      setBalance(100000);
      setPositions([]);
      setTrades([]);
      onPortfolioChange([]);
    }
  };

  const calculateTotalPortfolioValue = () => {
    return positions.reduce((total, pos) => total + pos.totalValue, 0) + balance;
  };

  const calculateTotalUnrealizedPnL = () => {
    return positions.reduce((total, pos) => total + pos.unrealizedPnL, 0);
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Paper Trading</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsTrading(!isTrading)}
            className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors"
          >
            {isTrading ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button
            onClick={resetAccount}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
            title="Reset Account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700 p-3 rounded-lg">
          <div className="text-sm text-dark-400">Cash Balance</div>
          <div className="text-lg font-semibold text-white">
            ${balance.toLocaleString()}
          </div>
        </div>
        <div className="bg-dark-700 p-3 rounded-lg">
          <div className="text-sm text-dark-400">Portfolio Value</div>
          <div className="text-lg font-semibold text-white">
            ${calculateTotalPortfolioValue().toLocaleString()}
          </div>
        </div>
        <div className="bg-dark-700 p-3 rounded-lg">
          <div className="text-sm text-dark-400">Positions</div>
          <div className="text-lg font-semibold text-white">
            {positions.length}
          </div>
        </div>
        <div className="bg-dark-700 p-3 rounded-lg">
          <div className="text-sm text-dark-400">Unrealized P&L</div>
          <div className={`text-lg font-semibold ${
            calculateTotalUnrealizedPnL() >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${calculateTotalUnrealizedPnL().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Trading Form */}
      {isTrading && (
        <div className="bg-dark-700 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-medium text-white mb-3">Execute Trade</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Symbol (e.g., AAPL)"
              value={tradeForm.symbol}
              onChange={(e) => setTradeForm({ ...tradeForm, symbol: e.target.value })}
              className="input-field"
            />
            <select
              value={tradeForm.type}
              onChange={(e) => setTradeForm({ ...tradeForm, type: e.target.value as 'buy' | 'sell' })}
              className="input-field"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <input
              type="number"
              placeholder="Shares"
              value={tradeForm.shares}
              onChange={(e) => setTradeForm({ ...tradeForm, shares: parseFloat(e.target.value) || 0 })}
              className="input-field"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Price per Share"
              value={tradeForm.price}
              onChange={(e) => setTradeForm({ ...tradeForm, price: parseFloat(e.target.value) || 0 })}
              className="input-field"
              min="0"
              step="0.01"
            />
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">
                Total: ${(tradeForm.shares * tradeForm.price).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex justify-end mt-3 space-x-2">
            <button
              onClick={() => setIsTrading(false)}
              className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={executeTrade}
              className={`px-4 py-2 rounded text-white transition-colors ${
                tradeForm.type === 'buy' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {tradeForm.type === 'buy' ? 'Buy' : 'Sell'} {tradeForm.symbol}
            </button>
          </div>
        </div>
      )}

      {/* Current Positions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-dark-300 mb-3">Current Positions</h4>
        <div className="space-y-3">
          {positions.map((position) => (
            <div key={position.symbol} className="bg-dark-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-white">{position.symbol}</div>
                  <div className="text-sm text-dark-400">
                    {position.shares} shares @ ${position.avgPrice.toFixed(2)} avg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    ${position.totalValue.toLocaleString()}
                  </div>
                  <div className={`text-sm ${
                    position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.unrealizedPnL >= 0 ? '+' : ''}{position.unrealizedPnL.toFixed(2)} 
                    ({position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {positions.length === 0 && (
          <div className="text-center py-6 text-dark-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No open positions</p>
          </div>
        )}
      </div>

      {/* Trade History */}
      <div>
        <h4 className="text-sm font-medium text-dark-300 mb-3">Trade History</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {trades.slice(0, 10).map((trade) => (
            <div key={trade.id} className="bg-dark-700 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  trade.type === 'buy' ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div>
                  <div className="text-white font-medium">
                    {trade.type.toUpperCase()} {trade.symbol}
                  </div>
                  <div className="text-sm text-dark-400">
                    {trade.shares} shares @ ${trade.price}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  ${trade.total.toLocaleString()}
                </div>
                <div className="text-xs text-dark-400">
                  {new Date(trade.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {trade.status === 'filled' && (
                  <CheckCircle className="w-4 h-4 text-green-400" aria-label="Filled" />
                )}
                {trade.status === 'cancelled' && (
                  <XCircle className="w-4 h-4 text-red-400" aria-label="Cancelled" />
                )}
                {trade.status === 'pending' && (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" aria-label="Pending" />
                )}
              </div>
            </div>
          ))}
        </div>
        {trades.length === 0 && (
          <div className="text-center py-6 text-dark-400">
            <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No trades yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperTrading;
