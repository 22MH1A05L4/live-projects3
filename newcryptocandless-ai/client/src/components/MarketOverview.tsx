import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MarketOverview: React.FC = () => {
  const marketData = [
    { symbol: 'AAPL', price: 150.25, change: 2.15, changePercent: 1.45 },
    { symbol: 'TSLA', price: 245.80, change: -5.20, changePercent: -2.07 },
    { symbol: 'GOOGL', price: 2750.50, change: 15.30, changePercent: 0.56 },
    { symbol: 'MSFT', price: 320.75, change: 3.45, changePercent: 1.09 },
    { symbol: 'BTC', price: 43250.00, change: 1250.00, changePercent: 2.98 },
    { symbol: 'ETH', price: 2650.00, change: -75.00, changePercent: -2.75 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {marketData.map((item) => (
        <div key={item.symbol} className="card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">{item.symbol}</h4>
              <p className="text-2xl font-bold text-white">${item.price.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center ${
                item.change >= 0 ? 'text-success-500' : 'text-danger-500'
              }`}>
                {item.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="font-medium">
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </span>
              </div>
              <div className={`text-sm ${
                item.changePercent >= 0 ? 'text-success-500' : 'text-danger-500'
              }`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketOverview;


