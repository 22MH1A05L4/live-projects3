import React, { useState, useEffect } from 'react';
import { Time } from 'lightweight-charts';
import apiService from './services/api';
import {
  Header,
  Sidebar,
  Chart,
  AIAnalysisPanel,
  MarketOverview,
  SearchComponent,
  // Advanced Trading Features
  TradingTools,
  PortfolioTracker,
  WatchlistManager,
  PaperTrading,
  NewsAnalysis,
  ScreenerTools,
  AlertsSystem,
  ExportFeatures,
  CustomThemes
} from './components';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Globe,
  Settings,
  Search,
  Bell,
  Star,
  PieChart,
  Filter,
  Download,
  Palette
} from 'lucide-react';
import './App.css';

interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface VolumeData {
  time: Time;
  value: number;
  color: string;
}

interface AIAnalysis {
  summary: string;
  recommendation: string;
  rationale: string;
  confidence: number;
}

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

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  condition: 'above' | 'below' | 'crosses';
  price: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
  isTriggered: boolean;
  notificationType: 'browser' | 'sound' | 'both';
}

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

interface Theme {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'custom';
  colors: any;
  isActive: boolean;
  isDefault: boolean;
}

const App: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [assetType, setAssetType] = useState<'stock' | 'crypto'>('stock');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('chart');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [screenerResults, setScreenerResults] = useState<ScreenerResult[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);


  // Mock data for fallback
  const mockMarketData = [
    { price: 150.25, volume: 45678900, change: 2.15 },
    { price: 148.10, volume: 23456700, change: -1.10 },
    { price: 149.25, volume: 34567800, change: 1.15 },
    { price: 147.50, volume: 56789000, change: -1.75 },
    { price: 149.75, volume: 12345600, change: 2.25 }
  ];

  useEffect(() => {
    if (selectedSymbol) {
      fetchData(selectedSymbol, assetType);
    }
  }, [selectedSymbol, assetType]);

  const fetchData = async (symbol: string, type: 'stock' | 'crypto') => {
    try {
      let data;
      if (type === 'stock') {
        data = await apiService.getStockData(symbol);
      } else {
        data = await apiService.getCryptoData(symbol);
      }

      if (data && data.chartData) {
        setChartData(data.chartData);
        setVolumeData(data.volumeData || []);
      } else {
        // Use mock data as fallback
        setChartData(mockMarketData.map((item, index) => ({
          time: (Math.floor(Date.now() / 1000) - (mockMarketData.length - index) * 86400) as Time,
          open: item.price * 0.99,
          high: item.price * 1.01,
          low: item.price * 0.98,
          close: item.price,
          volume: item.volume
        })));
        setVolumeData(mockMarketData.map((item, index) => ({
          time: (Math.floor(Date.now() / 1000) - (mockMarketData.length - index) * 86400) as Time,
          value: item.volume,
          color: item.change > 0 ? '#10b981' : '#ef4444'
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use mock data as fallback
      setChartData(mockMarketData.map((item, index) => ({
        time: (Math.floor(Date.now() / 1000) - (mockMarketData.length - index) * 86400) as Time,
        open: item.price * 0.99,
        high: item.price * 1.01,
        low: item.price * 0.98,
        close: item.price,
        volume: item.volume
      })));
      setVolumeData(mockMarketData.map((item, index) => ({
        time: (Math.floor(Date.now() / 1000) - (mockMarketData.length - index) * 86400) as Time,
        value: item.volume,
        color: item.change > 0 ? '#10b981' : '#ef4444'
      })));
    }
  };

  const handleSearch = async (query: string, type: 'stock' | 'crypto') => {
    try {
      const results = await apiService.searchSymbol(query, type);
      if (results && results.length > 0) {
        setSelectedSymbol(results[0].symbol);
        setAssetType(type);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleAIAnalysis = () => {
    if (chartData.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      if (chartData.length > 0) {
        const lastData = chartData[chartData.length - 1];
        const firstData = chartData[0];
        const isPositive = lastData.close > firstData.close;
        const hasHighVolume = (lastData.volume || 0) > 1000000;
        
        setAiAnalysis({
          summary: `Analysis of ${selectedSymbol} shows ${isPositive ? 'positive' : 'negative'} momentum with strong ${hasHighVolume ? 'high' : 'moderate'} volume.`,
          recommendation: isPositive ? 'BUY' : 'SELL',
          rationale: `Price action indicates ${isPositive ? 'bullish' : 'bearish'} trend with support at key levels.`,
          confidence: Math.floor(Math.random() * 30) + 70
        });
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleExport = async (options: any) => {
    console.log('Exporting chart with options:', options);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Chart exported successfully!');
  };

  const handleDataExport = async (options: any) => {
    console.log('Exporting data with options:', options);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Data exported successfully!');
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    // Apply theme to the application
    console.log('Theme changed to:', theme.name);
  };

  const tabs = [
    { id: 'chart', label: 'Chart', icon: BarChart3 },
    { id: 'trading', label: 'Trading Tools', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'paper-trading', label: 'Paper Trading', icon: DollarSign },
    { id: 'news', label: 'News & Analysis', icon: Globe },
    { id: 'screener', label: 'Screener', icon: Filter },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'themes', label: 'Themes', icon: Palette }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chart':
        return (
          <div className="space-y-6">
            <Chart 
              symbol={selectedSymbol}
              data={chartData} 
              volumeData={volumeData}
              isLoading={false}
              selectedType={assetType}
            />
            <AIAnalysisPanel
              symbol={selectedSymbol}
              data={chartData}
              onAnalyze={handleAIAnalysis}
              analysis={aiAnalysis}
              isLoading={isAnalyzing}
            />
          </div>
        );
      
      case 'trading':
        return (
          <TradingTools />
        );
      
      case 'portfolio':
        return (
          <PortfolioTracker
            onPortfolioChange={setPortfolio}
          />
        );
      
      case 'watchlist':
        return (
          <WatchlistManager
            onWatchlistChange={setWatchlist}
          />
        );
      
      case 'paper-trading':
        return (
          <PaperTrading
            onPortfolioChange={(positions) => console.log('Paper trading positions:', positions)}
          />
        );
      
      case 'news':
        return (
          <NewsAnalysis
            onNewsChange={(news) => console.log('News updated:', news)}
          />
        );
      
      case 'screener':
        return (
          <ScreenerTools
            onResultsChange={setScreenerResults}
          />
        );
      
      case 'alerts':
        return (
          <AlertsSystem
            onAlertsChange={setAlerts}
          />
        );
      
      case 'export':
        return (
          <ExportFeatures
            onExport={handleExport}
            onDataExport={handleDataExport}
            chartData={chartData}
            volumeData={volumeData}
          />
        );
      
      case 'themes':
        return (
          <CustomThemes
            onThemeChange={handleThemeChange}
          />
        );
      
      default:
        return (
          <div className="text-center py-8 text-dark-400">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <SearchComponent
              onSymbolSelect={(symbol, type) => {
                setSelectedSymbol(symbol);
                setAssetType(type);
              }}
            />
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-dark-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white border-b-2 border-primary-400'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
