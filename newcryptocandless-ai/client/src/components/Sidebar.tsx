import React from 'react';
import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  MoreHorizontal,
  Star,
  Bitcoin,
  Activity
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigationItems = [
    { name: 'Home', icon: Home, href: '/', current: true },
    { name: 'Products', icon: BarChart3, href: '/products', current: false },
    { name: 'Community', icon: Users, href: '/community', current: false },
    { name: 'Markets', icon: TrendingUp, href: '/markets', current: false },
    { name: 'Brokers', icon: Building2, href: '/brokers', current: false },
    { name: 'More', icon: MoreHorizontal, href: '/more', current: false },
  ];

  const quickActions = [
    { name: 'Watchlist', icon: Star, href: '#', count: 12 },
    { name: 'Portfolio', icon: Bitcoin, href: '#', count: 8 },
    { name: 'Activity', icon: Activity, href: '#', count: 25 },
  ];

  return (
    <div className="w-64 bg-dark-800 border-r border-dark-700 min-h-screen">
      <div className="p-6">
        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-dark-300 rounded-md hover:bg-dark-700 hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </div>
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-4">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-300 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


