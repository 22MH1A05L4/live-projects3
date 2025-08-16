import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellOff, 
  Plus, 
  Trash2, 
  Edit3, 
  Save,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

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

interface AlertsSystemProps {
  onAlertsChange: (alerts: PriceAlert[]) => void;
}

const AlertsSystem: React.FC<AlertsSystemProps> = ({ onAlertsChange }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    name: '',
    type: 'stock' as 'stock' | 'crypto',
    condition: 'above' as 'above' | 'below' | 'crosses',
    price: 0,
    notificationType: 'both' as 'browser' | 'sound' | 'both'
  });

  // Load alerts from localStorage on component mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('cryptocandle-alerts');
    if (savedAlerts) {
      const parsedAlerts = JSON.parse(savedAlerts);
      setAlerts(parsedAlerts);
      onAlertsChange(parsedAlerts);
    }
  }, [onAlertsChange]);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cryptocandle-alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Check for triggered alerts (simulate price monitoring)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate price changes and check alerts
      const updatedAlerts = alerts.map(alert => {
        if (alert.isTriggered || !alert.isActive) return alert;

        // Simulate random price movement
        const currentPrice = Math.random() * 1000; // Mock current price
        
        let shouldTrigger = false;
        if (alert.condition === 'above' && currentPrice > alert.price) {
          shouldTrigger = true;
        } else if (alert.condition === 'below' && currentPrice < alert.price) {
          shouldTrigger = true;
        } else if (alert.condition === 'crosses') {
          // For crosses, we'd need to track previous price
          shouldTrigger = false;
        }

        if (shouldTrigger) {
          triggerAlert(alert.id);
          return {
            ...alert,
            isTriggered: true,
            triggeredAt: new Date().toISOString()
          };
        }

        return alert;
      });

      setAlerts(updatedAlerts);
      onAlertsChange(updatedAlerts);
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [alerts, onAlertsChange]);

  const addAlert = () => {
    if (!newAlert.symbol || !newAlert.name || newAlert.price <= 0) {
      window.alert('Please fill all fields correctly');
      return;
    }

    const newPriceAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol.toUpperCase(),
      name: newAlert.name,
      type: newAlert.type,
      condition: newAlert.condition,
      price: newAlert.price,
      isActive: true,
      createdAt: new Date().toISOString(),
      isTriggered: false,
      notificationType: newAlert.notificationType
    };

    const updatedAlerts = [...alerts, newPriceAlert];
    setAlerts(updatedAlerts);
    onAlertsChange(updatedAlerts);
    
    // Reset form
    setNewAlert({ symbol: '', name: '', type: 'stock', condition: 'above', price: 0, notificationType: 'both' });
    setIsAdding(false);
  };

  const removeAlert = (id: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
    onAlertsChange(updatedAlerts);
  };

  const toggleAlert = (id: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    );
    setAlerts(updatedAlerts);
    onAlertsChange(updatedAlerts);
  };

  const startEditing = (alert: PriceAlert) => {
    setEditingId(alert.id);
    setNewAlert({
      symbol: alert.symbol,
      name: alert.name,
      type: alert.type,
      condition: alert.condition,
      price: alert.price,
      notificationType: alert.notificationType
    });
  };

  const saveEdit = () => {
    if (!editingId) return;

    const updatedAlerts = alerts.map(alert => 
      alert.id === editingId 
        ? { 
            ...alert, 
            symbol: newAlert.symbol.toUpperCase(),
            name: newAlert.name,
            type: newAlert.type,
            condition: newAlert.condition,
            price: newAlert.price,
            notificationType: newAlert.notificationType
          }
        : alert
    );

    setAlerts(updatedAlerts);
    onAlertsChange(updatedAlerts);
    setEditingId(null);
    setNewAlert({ symbol: '', name: '', type: 'stock', condition: 'above', price: 0, notificationType: 'both' });
  };

  const triggerAlert = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    // Browser notification
    if (alert.notificationType === 'browser' || alert.notificationType === 'both') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Price Alert: ${alert.symbol}`, {
          body: `${alert.symbol} is now ${alert.condition} $${alert.price}`,
          icon: '/favicon.ico'
        });
      }
    }

    // Sound notification
    if (alert.notificationType === 'sound' || alert.notificationType === 'both') {
      // Play alert sound (you can add an audio file)
      console.log('🔔 Alert sound played');
    }
  };

  const clearAllTriggered = () => {
    const updatedAlerts = alerts.map(alert => ({
      ...alert,
      isTriggered: false,
      triggeredAt: undefined
    }));
    setAlerts(updatedAlerts);
    onAlertsChange(updatedAlerts);
  };

  const getActiveAlerts = () => alerts.filter(alert => alert.isActive);
  const getTriggeredAlerts = () => alerts.filter(alert => alert.isTriggered);
  const getInactiveAlerts = () => alerts.filter(alert => !alert.isActive);

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'above': return 'goes above';
      case 'below': return 'goes below';
      case 'crosses': return 'crosses';
      default: return condition;
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'above': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'below': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'crosses': return <DollarSign className="w-4 h-4 text-blue-400" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Price Alerts
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearAllTriggered}
            className="p-2 bg-dark-700 hover:bg-dark-600 rounded text-white transition-colors"
            title="Clear all triggered alerts"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-2 bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors"
          >
            {isAdding ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Add New Alert Form */}
      {isAdding && (
        <div className="bg-dark-700 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-medium text-white mb-3">Create New Price Alert</h4>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <input
              type="text"
              placeholder="Symbol (e.g., AAPL)"
              value={newAlert.symbol}
              onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={newAlert.name}
              onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
              className="input-field"
            />
            <select
              value={newAlert.type}
              onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as 'stock' | 'crypto' })}
              className="input-field"
            >
              <option value="stock">Stock</option>
              <option value="crypto">Crypto</option>
            </select>
            <select
              value={newAlert.condition}
              onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as 'above' | 'below' | 'crosses' })}
              className="input-field"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
              <option value="crosses">Crosses</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={newAlert.price}
              onChange={(e) => setNewAlert({ ...newAlert, price: parseFloat(e.target.value) || 0 })}
              className="input-field"
              min="0"
              step="0.01"
            />
            <select
              value={newAlert.notificationType}
              onChange={(e) => setNewAlert({ ...newAlert, notificationType: e.target.value as 'browser' | 'sound' | 'both' })}
              className="input-field"
            >
              <option value="both">Browser + Sound</option>
              <option value="browser">Browser Only</option>
              <option value="sound">Sound Only</option>
            </select>
          </div>
          <div className="flex justify-end mt-3 space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addAlert}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors"
            >
              Create Alert
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center">
          <Bell className="w-4 h-4 mr-2 text-green-400" />
          Active Alerts ({getActiveAlerts().length})
        </h4>
        <div className="space-y-3">
          {getActiveAlerts().map((alert) => (
            <div key={alert.id} className="bg-dark-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-semibold text-white">{alert.symbol}</div>
                      <div className="text-sm text-dark-400">{alert.name}</div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-dark-600 rounded capitalize">
                      {alert.type}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-dark-300">
                      {getConditionIcon(alert.condition)}
                      <span>{getConditionText(alert.condition)}</span>
                      <span className="text-white font-medium">${alert.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    title="Deactivate alert"
                  >
                    <BellOff className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startEditing(alert)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Edit alert"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Triggered Alerts */}
      {getTriggeredAlerts().length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
            Triggered Alerts ({getTriggeredAlerts().length})
          </h4>
          <div className="space-y-3">
            {getTriggeredAlerts().map((alert) => (
              <div key={alert.id} className="bg-yellow-900/20 border border-yellow-600/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-semibold text-yellow-400">{alert.symbol}</div>
                        <div className="text-sm text-yellow-300">{alert.name}</div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-yellow-600/30 text-yellow-300 rounded">
                        TRIGGERED
                      </div>
                      <div className="text-sm text-yellow-300">
                        {alert.triggeredAt && `at ${new Date(alert.triggeredAt).toLocaleTimeString()}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Alerts */}
      {getInactiveAlerts().length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center">
            <BellOff className="w-4 h-4 mr-2 text-dark-400" />
            Inactive Alerts ({getInactiveAlerts().length})
          </h4>
          <div className="space-y-2">
            {getInactiveAlerts().map((alert) => (
              <div key={alert.id} className="bg-dark-700 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium text-white">{alert.symbol}</div>
                    <div className="text-sm text-dark-400">{alert.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="p-2 text-dark-400 hover:text-green-400 transition-colors"
                    title="Activate alert"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="text-center py-8 text-dark-400">
          <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No price alerts set.</p>
          <p className="text-sm">Create alerts to monitor price movements!</p>
        </div>
      )}
    </div>
  );
};

export default AlertsSystem;
