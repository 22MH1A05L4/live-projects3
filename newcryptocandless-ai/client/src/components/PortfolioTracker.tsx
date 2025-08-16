import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  PieChart,
  BarChart3,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  lastUpdated: string;
}

interface PortfolioTrackerProps {
  onPortfolioChange: (portfolio: PortfolioItem[]) => void;
}

const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({ onPortfolioChange }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    symbol: '',
    name: '',
    type: 'stock' as 'stock' | 'crypto',
    shares: 0,
    avgPrice: 0
  });

  // Load portfolio from localStorage on component mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('cryptocandle-portfolio');
    if (savedPortfolio) {
      const parsedPortfolio = JSON.parse(savedPortfolio);
      setPortfolio(parsedPortfolio);
      onPortfolioChange(parsedPortfolio);
    }
  }, [onPortfolioChange]);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cryptocandle-portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addToPortfolio = () => {
    if (!newItem.symbol || !newItem.name || newItem.shares <= 0 || newItem.avgPrice <= 0) {
      alert('Please fill all fields correctly');
      return;
    }

    const item: PortfolioItem = {
      id: Date.now().toString(),
      symbol: newItem.symbol.toUpperCase(),
      name: newItem.name,
      type: newItem.type,
      shares: newItem.shares,
      avgPrice: newItem.avgPrice,
      currentPrice: newItem.avgPrice, // Start with average price
      lastUpdated: new Date().toISOString()
    };

    const updatedPortfolio = [...portfolio, item];
    setPortfolio(updatedPortfolio);
    onPortfolioChange(updatedPortfolio);
    
    // Reset form
    setNewItem({ symbol: '', name: '', type: 'stock', shares: 0, avgPrice: 0 });
    setIsAdding(false);
  };

  const removeFromPortfolio = (id: string) => {
    const updatedPortfolio = portfolio.filter(item => item.id !== id);
    setPortfolio(updatedPortfolio);
    onPortfolioChange(updatedPortfolio);
  };

  const startEditing = (item: PortfolioItem) => {
    setEditingId(item.id);
    setNewItem({
      symbol: item.symbol,
      name: item.name,
      type: item.type,
      shares: item.shares,
      avgPrice: item.avgPrice
    });
  };

  const saveEdit = () => {
    if (!editingId) return;

    const updatedPortfolio = portfolio.map(item => 
      item.id === editingId 
        ? { 
            ...item, 
            symbol: newItem.symbol.toUpperCase(),
            name: newItem.name,
            type: newItem.type,
            shares: newItem.shares,
            avgPrice: newItem.avgPrice
          }
        : item
    );

    setPortfolio(updatedPortfolio);
    onPortfolioChange(updatedPortfolio);
    setEditingId(null);
    setNewItem({ symbol: '', name: '', type: 'stock', shares: 0, avgPrice: 0 });
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((total, item) => total + (item.shares * item.currentPrice), 0);
  };

  const calculateTotalCost = () => {
    return portfolio.reduce((total, item) => total + (item.shares * item.avgPrice), 0);
  };

  const calculateTotalGainLoss = () => {
    return calculateTotalValue() - calculateTotalCost();
  };

  const calculateGainLossPercent = () => {
    const totalCost = calculateTotalCost();
    if (totalCost === 0) return 0;
    return (calculateTotalGainLoss() / totalCost) * 100;
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Portfolio Tracker</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors"
        >
          {isAdding ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700 p-3 rounded-lg">
          <div className="text-sm text-dark-400">Total Value</div>
          <div className="text-lg font-semibold text-white">
            ${calculateTotalValue().toLocaleString()}
          </div>
        </div>
        <div className="bg-dark-700 p-3 rounded-lg">
          <div className="text-sm text-dark-400">Total Cost</div>
          <div className="text-lg font-semibold text-white">
            ${calculateTotalCost().toLocaleString()}
          </div>
        </div>
        <div className="bg-dark-700 p-3 rounded-lg">
          <div className="text-sm text-dark-400">Gain/Loss</div>
          <div className={`text-lg font-semibold ${
            calculateTotalGainLoss() >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${calculateTotalGainLoss().toLocaleString()}
          </div>
        </div>
        <div className="bg-dark-700 p-3 rounded-lg">
          <div className="text-sm text-dark-400">Gain/Loss %</div>
          <div className={`text-lg font-semibold ${
            calculateGainLossPercent() >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {calculateGainLossPercent().toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <div className="bg-dark-700 p-4 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-white mb-3">Add New Position</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Symbol (e.g., AAPL)"
              value={newItem.symbol}
              onChange={(e) => setNewItem({ ...newItem, symbol: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="input-field"
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'stock' | 'crypto' })}
              className="input-field"
            >
              <option value="stock">Stock</option>
              <option value="crypto">Crypto</option>
            </select>
            <input
              type="number"
              placeholder="Shares"
              value={newItem.shares}
              onChange={(e) => setNewItem({ ...newItem, shares: parseFloat(e.target.value) || 0 })}
              className="input-field"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Avg Price"
              value={newItem.avgPrice}
              onChange={(e) => setNewItem({ ...newItem, avgPrice: parseFloat(e.target.value) || 0 })}
              className="input-field"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex justify-end mt-3 space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addToPortfolio}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors"
            >
              Add Position
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Items */}
      <div className="space-y-3">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-dark-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-semibold text-white">{item.symbol}</div>
                    <div className="text-sm text-dark-400">{item.name}</div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-dark-600 rounded capitalize">
                    {item.type}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-medium">
                  ${(item.shares * item.currentPrice).toLocaleString()}
                </div>
                <div className="text-sm text-dark-400">
                  {item.shares} shares @ ${item.currentPrice}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {editingId === item.id ? (
                  <button
                    onClick={saveEdit}
                    className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(item)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => removeFromPortfolio(item.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Position Performance */}
            <div className="mt-3 pt-3 border-t border-dark-600">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-dark-400">Avg Price: </span>
                  <span className="text-white">${item.avgPrice}</span>
                </div>
                <div>
                  <span className="text-dark-400">Gain/Loss: </span>
                  <span className={item.currentPrice >= item.avgPrice ? 'text-green-400' : 'text-red-400'}>
                    ${((item.currentPrice - item.avgPrice) * item.shares).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-dark-400">% Change: </span>
                  <span className={item.currentPrice >= item.avgPrice ? 'text-green-400' : 'text-red-400'}>
                    {((item.currentPrice - item.avgPrice) / item.avgPrice * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolio.length === 0 && (
        <div className="text-center py-8 text-dark-400">
          <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No positions in your portfolio yet.</p>
          <p className="text-sm">Add your first position to start tracking!</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioTracker;


