import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  Star,
  Eye,
  Download,
  Share2,
  RefreshCw,
  Settings
} from 'lucide-react';

interface ScreenerResult {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe?: number;
  dividend?: number;
  sector?: string;
  industry?: string;
}

interface ScreenerFilters {
  type: 'stock' | 'crypto' | 'all';
  priceMin: number;
  priceMax: number;
  changeMin: number;
  changeMax: number;
  volumeMin: number;
  marketCapMin: number;
  sector: string;
  industry: string;
}

interface ScreenerToolsProps {
  onResultsChange: (results: ScreenerResult[]) => void;
}

const ScreenerTools: React.FC<ScreenerToolsProps> = ({ onResultsChange }) => {
  const [filters, setFilters] = useState<ScreenerFilters>({
    type: 'all',
    priceMin: 0,
    priceMax: 10000,
    changeMin: -100,
    changeMax: 100,
    volumeMin: 0,
    marketCapMin: 0,
    sector: '',
    industry: ''
  });
  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedResults = localStorage.getItem('cryptocandle-screener-results');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults);
      onResultsChange(parsedResults);
    } else {
      // Initialize with mock data
      generateMockResults();
    }
  }, [onResultsChange]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cryptocandle-screener-results', JSON.stringify(results));
  }, [results]);

  const generateMockResults = () => {
    const mockResults: ScreenerResult[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'stock',
        price: 150.25,
        change: 2.15,
        changePercent: 1.45,
        volume: 45678900,
        marketCap: 2500000000000,
        pe: 25.5,
        dividend: 0.88,
        sector: 'Technology',
        industry: 'Consumer Electronics'
      },
      {
        id: '2',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        type: 'stock',
        price: 245.80,
        change: -5.20,
        changePercent: -2.07,
        volume: 23456700,
        marketCap: 780000000000,
        pe: 45.2,
        sector: 'Consumer Discretionary',
        industry: 'Automobiles'
      },
      {
        id: '3',
        symbol: 'BTC',
        name: 'Bitcoin',
        type: 'crypto',
        price: 43250.00,
        change: 1250.00,
        changePercent: 2.98,
        volume: 98765400,
        marketCap: 850000000000
      },
      {
        id: '4',
        symbol: 'ETH',
        name: 'Ethereum',
        type: 'crypto',
        price: 2650.00,
        change: -75.00,
        changePercent: -2.75,
        volume: 87654300,
        marketCap: 320000000000
      },
      {
        id: '5',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        type: 'stock',
        price: 2750.50,
        change: 15.30,
        changePercent: 0.56,
        volume: 12345600,
        marketCap: 1850000000000,
        pe: 28.3,
        sector: 'Technology',
        industry: 'Internet Services'
      },
      {
        id: '6',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        type: 'stock',
        price: 320.75,
        change: 3.45,
        changePercent: 1.09,
        volume: 34567800,
        marketCap: 2400000000000,
        pe: 32.1,
        dividend: 2.72,
        sector: 'Technology',
        industry: 'Software'
      }
    ];
    setResults(mockResults);
    onResultsChange(mockResults);
  };

  const applyFilters = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = results.filter(item => {
        // Type filter
        if (filters.type !== 'all' && item.type !== filters.type) return false;
        
        // Price filter
        if (item.price < filters.priceMin || item.price > filters.priceMax) return false;
        
        // Change filter
        if (item.changePercent < filters.changeMin || item.changePercent > filters.changeMax) return false;
        
        // Volume filter
        if (item.volume < filters.volumeMin) return false;
        
        // Market cap filter
        if (item.marketCap < filters.marketCapMin) return false;
        
        // Sector filter
        if (filters.sector && item.sector !== filters.sector) return false;
        
        // Industry filter
        if (filters.industry && item.industry !== filters.industry) return false;
        
        return true;
      });

      // Apply sorting
      filtered.sort((a, b) => {
        let aValue = a[sortBy as keyof ScreenerResult];
        let bValue = b[sortBy as keyof ScreenerResult];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return (aValue as any) > (bValue as any) ? 1 : -1;
        } else {
          return (aValue as any) < (bValue as any) ? 1 : -1;
        }
      });

      setResults(filtered);
      onResultsChange(filtered);
      setIsLoading(false);
    }, 1000);
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      priceMin: 0,
      priceMax: 10000,
      changeMin: -100,
      changeMax: 100,
      volumeMin: 0,
      marketCapMin: 0,
      sector: '',
      industry: ''
    });
    generateMockResults();
  };

  const exportResults = () => {
    const csvContent = [
      ['Symbol', 'Name', 'Type', 'Price', 'Change', 'Change %', 'Volume', 'Market Cap', 'P/E', 'Dividend', 'Sector', 'Industry'],
      ...results.map(item => [
        item.symbol,
        item.name,
        item.type,
        item.price.toString(),
        item.change.toString(),
        item.changePercent.toString(),
        item.volume.toString(),
        item.marketCap.toString(),
        item.pe?.toString() || '',
        item.dividend?.toString() || '',
        item.sector || '',
        item.industry || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screener-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sectors = ['Technology', 'Healthcare', 'Financial', 'Consumer Discretionary', 'Energy', 'Materials', 'Real Estate', 'Utilities'];
  const industries = ['Software', 'Consumer Electronics', 'Internet Services', 'Biotechnology', 'Banking', 'Insurance', 'Automobiles', 'Oil & Gas'];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Market Screener
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportResults}
            className="p-2 bg-dark-700 hover:bg-dark-600 rounded text-white transition-colors"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={resetFilters}
            className="p-2 bg-dark-700 hover:bg-dark-600 rounded text-white transition-colors"
            title="Reset filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-700 p-4 rounded-lg mb-6">
        <h4 className="text-sm font-medium text-white mb-3">Screening Criteria</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-dark-400 mb-1">Asset Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as 'stock' | 'crypto' | 'all' })}
              className="input-field w-full"
            >
              <option value="all">All Assets</option>
              <option value="stock">Stocks Only</option>
              <option value="crypto">Crypto Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-dark-400 mb-1">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: parseFloat(e.target.value) || 0 })}
                className="input-field flex-1"
                min="0"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: parseFloat(e.target.value) || 10000 })}
                className="input-field flex-1"
                min="0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-dark-400 mb-1">Change % Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min %"
                value={filters.changeMin}
                onChange={(e) => setFilters({ ...filters, changeMin: parseFloat(e.target.value) || -100 })}
                className="input-field flex-1"
                min="-100"
                max="100"
              />
              <input
                type="number"
                placeholder="Max %"
                value={filters.changeMax}
                onChange={(e) => setFilters({ ...filters, changeMax: parseFloat(e.target.value) || 100 })}
                className="input-field flex-1"
                min="-100"
                max="100"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-dark-400 mb-1">Min Volume</label>
            <input
              type="number"
              placeholder="Volume"
              value={filters.volumeMin}
              onChange={(e) => setFilters({ ...filters, volumeMin: parseFloat(e.target.value) || 0 })}
              className="input-field w-full"
              min="0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs text-dark-400 mb-1">Min Market Cap</label>
            <input
              type="number"
              placeholder="Market Cap"
              value={filters.marketCapMin}
              onChange={(e) => setFilters({ ...filters, marketCapMin: parseFloat(e.target.value) || 0 })}
              className="input-field w-full"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-xs text-dark-400 mb-1">Sector</label>
            <select
              value={filters.sector}
              onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              className="input-field w-full"
            >
              <option value="">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-dark-400 mb-1">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              className="input-field w-full"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={applyFilters}
            disabled={isLoading}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 rounded text-white transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Filtering...</span>
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                <span>Apply Filters</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-white">
            Results ({results.length} assets found)
          </h4>
          <div className="flex items-center space-x-3">
            <label className="text-xs text-dark-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-xs"
            >
              <option value="changePercent">Change %</option>
              <option value="price">Price</option>
              <option value="volume">Volume</option>
              <option value="marketCap">Market Cap</option>
              <option value="symbol">Symbol</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-dark-400 hover:text-white transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {results.map((item) => (
            <div key={item.symbol} className="bg-dark-700 p-4 rounded-lg">
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
                    {item.sector && (
                      <div className="text-xs px-2 py-1 bg-blue-600 rounded">
                        {item.sector}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-medium">
                    ${item.price.toLocaleString()}
                  </div>
                  <div className={`text-sm ${
                    item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="text-sm text-dark-400">
                    Vol: {item.volume.toLocaleString()}
                  </div>
                  <div className="text-sm text-dark-400">
                    MC: ${(item.marketCap / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <button className="p-2 text-dark-400 hover:text-yellow-400 transition-colors" title="Add to watchlist">
                    <Star className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-dark-400 hover:text-white transition-colors" title="View details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-dark-400 hover:text-white transition-colors" title="View chart">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-8 text-dark-400">
            <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No assets match your screening criteria.</p>
            <p className="text-sm">Try adjusting your filters or reset to see all assets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenerTools;
