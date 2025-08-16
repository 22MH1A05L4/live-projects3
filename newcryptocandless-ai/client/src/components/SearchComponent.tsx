import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import apiService from '../services/api';

interface SearchResult {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price?: number;
  change?: number;
}

interface SearchComponentProps {
  onSymbolSelect: (symbol: string, type: 'stock' | 'crypto') => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSymbolSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState<'stock' | 'crypto'>('stock');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      let results: SearchResult[] = [];
      
      if (selectedType === 'stock') {
        try {
          const stockData = await apiService.getStockData(searchTerm);
          results = [{
            symbol: stockData.symbol,
            name: stockData.name || stockData.symbol,
            type: 'stock' as const,
            price: stockData.price,
            change: stockData.change
          }];
        } catch (error) {
          console.log('Stock not found, trying popular stocks');
          const popularStocks = await apiService.getPopularStocks();
          results = popularStocks
            .filter((stock: any) => 
              stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
              stock.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((stock: any) => ({
              symbol: stock.symbol,
              name: stock.name,
              type: 'stock' as const,
              price: stock.price,
              change: stock.change
            }));
        }
      } else {
        try {
          const cryptoData = await apiService.getCryptoData(searchTerm);
          results = [{
            symbol: cryptoData.symbol,
            name: cryptoData.name,
            type: 'crypto' as const,
            price: cryptoData.price,
            change: cryptoData.change
          }];
        } catch (error) {
          console.log('Crypto not found, trying popular cryptos');
          const popularCryptos = await apiService.getPopularCryptos();
          results = popularCryptos
            .filter((crypto: any) => 
              crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
              crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((crypto: any) => ({
              symbol: crypto.symbol,
              name: crypto.name,
              type: 'crypto' as const,
              price: crypto.price,
              change: crypto.change
            }));
        }
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSymbolSelect = (result: SearchResult) => {
    onSymbolSelect(result.symbol, result.type);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Search Symbols</h3>
      
      {/* Asset Type Toggle */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-white">Asset Type:</span>
        <div className="flex bg-dark-700 rounded-lg p-1">
          <button
            onClick={() => setSelectedType('stock')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === 'stock'
                ? 'bg-primary-600 text-white'
                : 'text-dark-300 hover:text-white'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setSelectedType('crypto')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === 'crypto'
                ? 'bg-primary-600 text-white'
                : 'text-dark-300 hover:text-white'
            }`}
          >
            Crypto
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${selectedType} symbols...`}
          className="input-field flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="btn-primary"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-white">Results:</h4>
          {searchResults.map((result) => (
            <div
              key={result.symbol}
              onClick={() => handleSymbolSelect(result)}
              className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer"
            >
              <div>
                <div className="font-medium text-white">{result.symbol}</div>
                <div className="text-sm text-dark-400">{result.name}</div>
              </div>
              {result.price && (
                <div className="text-right">
                  <div className="text-white">${result.price.toFixed(2)}</div>
                  <div className={`text-sm ${
                    (result.change || 0) >= 0 ? 'text-success-500' : 'text-danger-500'
                  }`}>
                    {(result.change || 0) >= 0 ? '+' : ''}{result.change?.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;


