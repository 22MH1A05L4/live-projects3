import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Save, 
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface Theme {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'custom';
  colors: ThemeColors;
  isActive: boolean;
  isDefault: boolean;
}

interface CustomThemesProps {
  onThemeChange: (theme: Theme) => void;
}

const CustomThemes: React.FC<CustomThemesProps> = ({ onThemeChange }) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTheme, setNewTheme] = useState({
    name: '',
    type: 'dark' as 'light' | 'dark' | 'custom',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#0f0f0f',
      surface: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#9ca3af',
      border: '#374151',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  });

  // Load themes from localStorage on component mount
  useEffect(() => {
    const savedThemes = localStorage.getItem('cryptocandle-themes');
    const savedCurrentTheme = localStorage.getItem('cryptocandle-current-theme');
    
    if (savedThemes) {
      const parsedThemes = JSON.parse(savedThemes);
      setThemes(parsedThemes);
      
      if (savedCurrentTheme) {
        const parsedCurrentTheme = JSON.parse(savedCurrentTheme);
        setCurrentTheme(parsedCurrentTheme);
        onThemeChange(parsedCurrentTheme);
      } else if (parsedThemes.length > 0) {
        const defaultTheme = parsedThemes.find((t: Theme) => t.isDefault) || parsedThemes[0];
        setCurrentTheme(defaultTheme);
        onThemeChange(defaultTheme);
      }
    } else {
      // Initialize with default themes
      initializeDefaultThemes();
    }
  }, [onThemeChange]);

  // Save themes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cryptocandle-themes', JSON.stringify(themes));
  }, [themes]);

  // Save current theme to localStorage whenever it changes
  useEffect(() => {
    if (currentTheme) {
      localStorage.setItem('cryptocandle-current-theme', JSON.stringify(currentTheme));
    }
  }, [currentTheme]);

  const initializeDefaultThemes = () => {
    const defaultThemes: Theme[] = [
      {
        id: 'dark-default',
        name: 'Dark Pro',
        type: 'dark',
        isActive: true,
        isDefault: true,
        colors: {
          primary: '#3b82f6',
          secondary: '#6b7280',
          accent: '#f59e0b',
          background: '#0f0f0f',
          surface: '#1a1a1a',
          text: '#ffffff',
          textSecondary: '#9ca3af',
          border: '#374151',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        }
      },
      {
        id: 'light-default',
        name: 'Light Classic',
        type: 'light',
        isActive: false,
        isDefault: true,
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#d97706',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          textSecondary: '#64748b',
          border: '#e2e8f0',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
          info: '#2563eb'
        }
      },
      {
        id: 'blue-dark',
        name: 'Blue Night',
        type: 'dark',
        isActive: false,
        isDefault: true,
        colors: {
          primary: '#1d4ed8',
          secondary: '#475569',
          accent: '#0ea5e9',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
          border: '#334155',
          success: '#047857',
          warning: '#ea580c',
          error: '#b91c1c',
          info: '#1d4ed8'
        }
      }
    ];
    
    setThemes(defaultThemes);
    setCurrentTheme(defaultThemes[0]);
    onThemeChange(defaultThemes[0]);
  };

  const createTheme = () => {
    if (!newTheme.name) {
      alert('Please enter a theme name');
      return;
    }

    const theme: Theme = {
      id: Date.now().toString(),
      name: newTheme.name,
      type: newTheme.type,
      colors: newTheme.colors,
      isActive: false,
      isDefault: false
    };

    const updatedThemes = [...themes, theme];
    setThemes(updatedThemes);
    
    // Reset form
    setNewTheme({
      name: '',
      type: 'dark',
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#f59e0b',
        background: '#0f0f0f',
        surface: '#1a1a1a',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        border: '#374151',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      }
    });
    setIsCreating(false);
  };

  const activateTheme = (themeId: string) => {
    const updatedThemes = themes.map(theme => ({
      ...theme,
      isActive: theme.id === themeId
    }));
    
    const selectedTheme = updatedThemes.find(t => t.id === themeId);
    if (selectedTheme) {
      setThemes(updatedThemes);
      setCurrentTheme(selectedTheme);
      onThemeChange(selectedTheme);
    }
  };

  const deleteTheme = (themeId: string) => {
    const themeToDelete = themes.find(t => t.id === themeId);
    if (themeToDelete?.isDefault) {
      alert('Cannot delete default themes');
      return;
    }

    if (themeToDelete?.isActive) {
      alert('Cannot delete active theme. Please activate another theme first.');
      return;
    }

    const updatedThemes = themes.filter(theme => theme.id !== themeId);
    setThemes(updatedThemes);
  };

  const startEditing = (theme: Theme) => {
    if (theme.isDefault) {
      alert('Cannot edit default themes');
      return;
    }
    
    setEditingId(theme.id);
    setNewTheme({
      name: theme.name,
      type: theme.type,
      colors: { ...theme.colors }
    });
  };

  const saveEdit = () => {
    if (!editingId) return;

    const updatedThemes = themes.map(theme => 
      theme.id === editingId 
        ? { 
            ...theme, 
            name: newTheme.name,
            type: newTheme.type,
            colors: newTheme.colors
          }
        : theme
    );

    setThemes(updatedThemes);
    
    if (currentTheme?.id === editingId) {
      const updatedCurrentTheme = updatedThemes.find(t => t.id === editingId);
      if (updatedCurrentTheme) {
        setCurrentTheme(updatedCurrentTheme);
        onThemeChange(updatedCurrentTheme);
      }
    }
    
    setEditingId(null);
    setNewTheme({
      name: '',
      type: 'dark',
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#f59e0b',
        background: '#0f0f0f',
        surface: '#1a1a1a',
        text: '#ffffff',
        textSecondary: '#9ca3af',
        border: '#374151',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      }
    });
  };

  const exportTheme = (theme: Theme) => {
    const themeData = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        if (importedTheme.name && importedTheme.colors) {
          const theme: Theme = {
            ...importedTheme,
            id: Date.now().toString(),
            isActive: false,
            isDefault: false
          };
          
          const updatedThemes = [...themes, theme];
          setThemes(updatedThemes);
          alert(`Theme "${theme.name}" imported successfully!`);
        } else {
          alert('Invalid theme file format');
        }
      } catch (error) {
        alert('Error importing theme file');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to default themes? This will remove all custom themes.')) {
      initializeDefaultThemes();
    }
  };

  const getThemePreview = (theme: Theme) => {
    return {
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      borderColor: theme.colors.border
    };
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Custom Themes
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefault}
            className="p-2 bg-dark-700 hover:bg-dark-600 rounded text-white transition-colors"
            title="Reset to defaults"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="p-2 bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors"
          >
            {isCreating ? <XCircle className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Create New Theme */}
      {isCreating && (
        <div className="bg-dark-700 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-medium text-white mb-3">Create New Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Theme Name"
              value={newTheme.name}
              onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
              className="input-field"
            />
            <select
              value={newTheme.type}
              onChange={(e) => setNewTheme({ ...newTheme, type: e.target.value as 'light' | 'dark' | 'custom' })}
              className="input-field"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="custom">Custom</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createTheme}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors"
              >
                Create Theme
              </button>
            </div>
          </div>

          {/* Color Picker Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(newTheme.colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs text-dark-400 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setNewTheme({
                      ...newTheme,
                      colors: { ...newTheme.colors, [key]: e.target.value }
                    })}
                    className="w-12 h-10 rounded border border-dark-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setNewTheme({
                      ...newTheme,
                      colors: { ...newTheme.colors, [key]: e.target.value }
                    })}
                    className="input-field flex-1 text-xs"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme List */}
      <div className="space-y-4">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-dark-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Theme Preview */}
                <div 
                  className="w-16 h-12 rounded border-2 border-dark-500 overflow-hidden"
                  style={getThemePreview(theme)}
                >
                  <div className="w-full h-1/3" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="w-full h-1/3" style={{ backgroundColor: theme.colors.surface }}></div>
                  <div className="w-full h-1/3" style={{ backgroundColor: theme.colors.accent }}></div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-medium">{theme.name}</h4>
                    {theme.isDefault && (
                      <span className="text-xs px-2 py-1 bg-blue-600 rounded">Default</span>
                    )}
                    {theme.isActive && (
                      <span className="text-xs px-2 py-1 bg-green-600 rounded">Active</span>
                    )}
                  </div>
                  <div className="text-sm text-dark-400 capitalize">
                    {theme.type} Theme
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!theme.isActive && (
                  <button
                    onClick={() => activateTheme(theme.id)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
                    title="Activate theme"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                
                {!theme.isDefault && (
                  <button
                    onClick={() => startEditing(theme)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
                    title="Edit theme"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => exportTheme(theme)}
                  className="p-2 bg-dark-600 hover:bg-dark-500 rounded text-white transition-colors"
                  title="Export theme"
                >
                  <Download className="w-4 h-4" />
                </button>
                
                {!theme.isDefault && !theme.isActive && (
                  <button
                    onClick={() => deleteTheme(theme.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                    title="Delete theme"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Import Theme */}
      <div className="mt-6 p-4 bg-dark-700 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-3">Import Theme</h4>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".json"
            onChange={importTheme}
            className="hidden"
            id="theme-import"
          />
          <label
            htmlFor="theme-import"
            className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded text-white transition-colors cursor-pointer flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Choose Theme File</span>
          </label>
          <span className="text-sm text-dark-400">
            Select a .json theme file to import
          </span>
        </div>
      </div>

      {themes.length === 0 && (
        <div className="text-center py-8 text-dark-400">
          <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No themes available.</p>
          <p className="text-sm">Create your first custom theme!</p>
        </div>
      )}
    </div>
  );
};

export default CustomThemes;
