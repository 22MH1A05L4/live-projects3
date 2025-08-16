import React, { useState } from 'react';
import { Menu, X, Search, Bell, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-500">CryptoCandle AI</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-dark-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="text-dark-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Markets
            </a>
            <a href="#" className="text-dark-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Portfolio
            </a>
            <a href="#" className="text-dark-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              News
            </a>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-dark-300 hover:text-white p-2">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-dark-300 hover:text-white p-2">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-dark-300 hover:text-white p-2">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-dark-300 hover:text-white p-2">
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-dark-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-800 border-t border-dark-700">
            <a href="#" className="text-dark-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </a>
            <a href="#" className="text-dark-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Markets
            </a>
            <a href="#" className="text-dark-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Portfolio
            </a>
            <a href="#" className="text-dark-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              News
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;


