import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  ExternalLink,
  Filter,
  Search,
  Bookmark,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'market' | 'crypto' | 'economy' | 'company' | 'general';
  sentiment: 'positive' | 'negative' | 'neutral';
  isBookmarked: boolean;
}

interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  date: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  previous: string;
  forecast: string;
  actual?: string;
}

interface NewsAnalysisProps {
  onNewsChange: (news: NewsItem[]) => void;
}

const NewsAnalysis: React.FC<NewsAnalysisProps> = ({ onNewsChange }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedNews = localStorage.getItem('cryptocandle-news');
    const savedEconomicEvents = localStorage.getItem('cryptocandle-economic-events');

    if (savedNews) {
      const parsedNews = JSON.parse(savedNews);
      setNews(parsedNews);
      onNewsChange(parsedNews);
    } else {
      // Initialize with mock data
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Bitcoin Surges Past $50,000 as Institutional Adoption Grows',
          summary: 'Bitcoin has reached a new milestone as major financial institutions continue to show interest in cryptocurrency investments.',
          source: 'CryptoNews',
          url: 'https://example.com/bitcoin-surge',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category: 'crypto',
          sentiment: 'positive',
          isBookmarked: false
        },
        {
          id: '2',
          title: 'Federal Reserve Signals Potential Interest Rate Changes',
          summary: 'The Federal Reserve has indicated possible adjustments to monetary policy in response to economic indicators.',
          source: 'Financial Times',
          url: 'https://example.com/fed-rates',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          category: 'economy',
          sentiment: 'neutral',
          isBookmarked: false
        },
        {
          id: '3',
          title: 'Tech Stocks Rally on Strong Earnings Reports',
          summary: 'Major technology companies have exceeded earnings expectations, driving market optimism.',
          source: 'MarketWatch',
          url: 'https://example.com/tech-rally',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          category: 'market',
          sentiment: 'positive',
          isBookmarked: false
        },
        {
          id: '4',
          title: 'Oil Prices Decline Amid Supply Concerns',
          summary: 'Crude oil prices have fallen as global supply increases and demand remains uncertain.',
          source: 'Reuters',
          url: 'https://example.com/oil-prices',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          category: 'market',
          sentiment: 'negative',
          isBookmarked: false
        }
      ];
      setNews(mockNews);
      onNewsChange(mockNews);
    }

    if (savedEconomicEvents) {
      setEconomicEvents(JSON.parse(savedEconomicEvents));
    } else {
      // Initialize with mock economic events
      const mockEvents: EconomicEvent[] = [
        {
          id: '1',
          title: 'Non-Farm Payrolls',
          country: 'USA',
          date: new Date().toISOString().split('T')[0],
          time: '08:30 EST',
          impact: 'high',
          previous: '187K',
          forecast: '185K'
        },
        {
          id: '2',
          title: 'CPI (Consumer Price Index)',
          country: 'USA',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '08:30 EST',
          impact: 'high',
          previous: '3.1%',
          forecast: '3.0%'
        },
        {
          id: '3',
          title: 'GDP Growth Rate',
          country: 'USA',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '08:30 EST',
          impact: 'medium',
          previous: '2.1%',
          forecast: '2.3%'
        }
      ];
      setEconomicEvents(mockEvents);
    }
  }, [onNewsChange]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cryptocandle-news', JSON.stringify(news));
    localStorage.setItem('cryptocandle-economic-events', JSON.stringify(economicEvents));
  }, [news, economicEvents]);

  const toggleBookmark = (newsId: string) => {
    const updatedNews = news.map(item => 
      item.id === newsId ? { ...item, isBookmarked: !item.isBookmarked } : item
    );
    setNews(updatedNews);
    onNewsChange(updatedNews);
  };

  const getFilteredNews = () => {
    let filtered = news;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedSentiment !== 'all') {
      filtered = filtered.filter(item => item.sentiment === selectedSentiment);
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (showBookmarked) {
      filtered = filtered.filter(item => item.isBookmarked);
    }

    return filtered;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="space-y-6">
      {/* News Section */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Newspaper className="w-5 h-5 mr-2" />
            Market News & Analysis
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBookmarked(!showBookmarked)}
              className={`p-2 rounded transition-colors ${
                showBookmarked 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-700 text-dark-300 hover:text-white'
              }`}
              title={showBookmarked ? 'Show all news' : 'Show bookmarked only'}
            >
              {showBookmarked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Search className="w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-1"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
            >
              <option value="all">All Categories</option>
              <option value="market">Market</option>
              <option value="crypto">Crypto</option>
              <option value="economy">Economy</option>
              <option value="company">Company</option>
              <option value="general">General</option>
            </select>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="px-3 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {getFilteredNews().map((item) => (
            <div key={item.id} className="bg-dark-700 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${
                      item.category === 'crypto' ? 'bg-purple-600' :
                      item.category === 'market' ? 'bg-blue-600' :
                      item.category === 'economy' ? 'bg-green-600' :
                      item.category === 'company' ? 'bg-yellow-600' :
                      'bg-gray-600'
                    }`}>
                      {item.category}
                    </span>
                    <span className={`text-xs ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <h4 className="text-white font-medium mb-2">{item.title}</h4>
                  <p className="text-dark-300 text-sm mb-3">{item.summary}</p>
                  <div className="flex items-center justify-between text-xs text-dark-400">
                    <span>{item.source}</span>
                    <span>{formatTimeAgo(item.publishedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2 transition-colors ${
                      item.isBookmarked 
                        ? 'text-yellow-400 hover:text-yellow-300' 
                        : 'text-dark-400 hover:text-white'
                    }`}
                    title={item.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    <Bookmark className={`w-4 h-4 ${item.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-dark-400 hover:text-white transition-colors"
                    title="Read full article"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button className="p-2 text-dark-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getFilteredNews().length === 0 && (
          <div className="text-center py-8 text-dark-400">
            <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No news found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Economic Calendar */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Economic Calendar
        </h3>
        
        <div className="space-y-3">
          {economicEvents.map((event) => (
            <div key={event.id} className="bg-dark-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white font-medium">{event.title}</h4>
                    <span className="text-xs px-2 py-1 bg-dark-600 rounded">
                      {event.country}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(event.impact)}`} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-dark-400">Date: </span>
                      <span className="text-white">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-dark-400">Time: </span>
                      <span className="text-white">{event.time}</span>
                    </div>
                    <div>
                      <span className="text-dark-400">Previous: </span>
                      <span className="text-white">{event.previous}</span>
                    </div>
                    <div>
                      <span className="text-dark-400">Forecast: </span>
                      <span className="text-white">{event.forecast}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-dark-400 hover:text-white transition-colors" title="Set reminder">
                    <Clock className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-dark-400 hover:text-white transition-colors" title="Add to watchlist">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {economicEvents.length === 0 && (
          <div className="text-center py-8 text-dark-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No economic events scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsAnalysis;


