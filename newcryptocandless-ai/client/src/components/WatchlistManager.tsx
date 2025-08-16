import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Star, 
  StarOff, 
  Trash2, 
  Eye, 
  EyeOff,
  TrendingUp,
  TrendingDown,
  Bell,
  BellOff
} from 'lucide-react';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  priceChangePercent: number;
  isWatched: boolean;
  hasAlerts: boolean;
  alertPrice?: number;
  lastUpdated: string;
}

interface WatchlistManagerProps {
  onWatchlistChange: (watchlist: WatchlistItem[]) => void;
}

const WatchlistManager: React.FC<WatchlistManagerProps> = ({ onWatchlistChange }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    symbol: '',
    name: '',
    type: 'stock' as 'stock' | 'crypto',
    alertPrice: 0
  });

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('cryptocandle-watchlist');
    if (savedWatchlist) {
      const parsedWatchlist = JSON.parse(savedWatchlist);
      setWatchlist(parsedWatchlist);
      onWatchlistChange(parsedWatchlist);
    }
  }, [onWatchlistChange]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cryptocandle-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = () => {
    if (!newItem.symbol || !newItem.name) {
      alert('Please fill all required fields');
      return;
    }

    const item: WatchlistItem = {
      id: Date.now().toString(),
      symbol: newItem.symbol.toUpperCase(),
      name: newItem.name,
      type: newItem.type,
      currentPrice: 0,
      previousPrice: 0,
      priceChange: 0,
      priceChangePercent: 0,
      isWatched: true,
      hasAlerts: newItem.alertPrice > 0,
      alertPrice: newItem.alertPrice > 0 ? newItem.alertPrice : undefined,
      lastUpdated: new Date().toISOString()
    };

    const updatedWatchlist = [...watchlist, item];
    setWatchlist(updatedWatchlist);
    onWatchlistChange(updatedWatchlist);
    
    // Reset form
    setNewItem({ symbol: '', name: '', type: 'stock', alertPrice: 0 });
    setIsAdding(false);
  };

  const removeFromWatchlist = (id: string) => {
    const updatedWatchlist = watchlist.filter(item => item.id !== id);
    setWatchlist(updatedWatchlist);
    onWatchlistChange(updatedWatchlist);
  };

  const toggleWatch = (id: string) => {
    const updatedWatchlist = watchlist.map(item => 
      item.id === id ? { ...item, isWatched: !item.isWatched } : item
    );
    setWatchlist(updatedWatchlist);
    onWatchlistChange(updatedWatchlist);
  };

  const toggleAlerts = (id: string) => {
    const updatedWatchlist = watchlist.map(item => 
      item.id === id ? { ...item, hasAlerts: !item.hasAlerts } : item
    );
    setWatchlist(updatedWatchlist);
    onWatchlistChange(updatedWatchlist);
  };

  const updateAlertPrice = (id: string, alertPrice: number) => {
    const updatedWatchlist = watchlist.map(item => 
      item.id === id ? { ...item, alertPrice, hasAlerts: alertPrice > 0 } : item
    );
    setWatchlist(updatedWatchlist);
    onWatchlistChange(updatedWatchlist);
  };

  const getWatchedItems = () => watchlist.filter(item => item.isWatched);
  const getUnwatchedItems = () => watchlist.filter(item => !item.isWatched);

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Watchlist Manager</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <div className="bg-dark-700 p-4 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-white mb-3">Add to Watchlist</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
              placeholder="Alert Price (optional)"
              value={newItem.alertPrice}
              onChange={(e) => setNewItem({ ...newItem, alertPrice: parseFloat(e.target.value) || 0 })}
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
              onClick={addToWatchlist}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      )}

      {/* Watched Items */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center">
          <Star className="w-4 h-4 mr-2 text-yellow-400" />
          Watched Items ({getWatchedItems().length})
        </h4>
        <div className="space-y-3">
          {getWatchedItems().map((item) => (
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
                    ${item.currentPrice || 'N/A'}
                  </div>
                  {item.currentPrice > 0 && (
                    <div className={`text-sm ${
                      item.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.priceChange >= 0 ? '+' : ''}{item.priceChange.toFixed(2)} 
                      ({item.priceChangePercent >= 0 ? '+' : ''}{item.priceChangePercent.toFixed(2)}%)
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleWatch(item.id)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                    title="Remove from watchlist"
                  >
                    <StarOff className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleAlerts(item.id)}
                    className={`p-2 transition-colors ${
                      item.hasAlerts ? 'text-green-400 hover:text-green-300' : 'text-dark-400 hover:text-white'
                    }`}
                    title={item.hasAlerts ? 'Disable alerts' : 'Enable alerts'}
                  >
                    {item.hasAlerts ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Remove completely"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alert Settings */}
              {item.hasAlerts && (
                <div className="mt-3 pt-3 border-t border-dark-600">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-dark-400">Alert when price:</span>
                    <input
                      type="number"
                      placeholder="Alert price"
                      value={item.alertPrice || ''}
                      onChange={(e) => updateAlertPrice(item.id, parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-xs bg-dark-600 border border-dark-500 rounded text-white"
                      min="0"
                      step="0.01"
                    />
                    <span className="text-xs text-dark-400">USD</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Unwatched Items */}
      {getUnwatchedItems().length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center">
            <EyeOff className="w-4 h-4 mr-2 text-dark-400" />
            Hidden Items ({getUnwatchedItems().length})
          </h4>
          <div className="space-y-2">
            {getUnwatchedItems().map((item) => (
              <div key={item.id} className="bg-dark-700 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium text-white">{item.symbol}</div>
                    <div className="text-sm text-dark-400">{item.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleWatch(item.id)}
                    className="p-2 text-dark-400 hover:text-yellow-400 transition-colors"
                    title="Add to watchlist"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Remove completely"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {watchlist.length === 0 && (
        <div className="text-center py-8 text-dark-400">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Your watchlist is empty.</p>
          <p className="text-sm">Add symbols to start monitoring!</p>
        </div>
      )}
    </div>
  );
};

export default WatchlistManager;


