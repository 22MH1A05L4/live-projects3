import React, { useState } from 'react';
import { 
  Ruler, 
  Minus, 
  Square, 
  Circle, 
  Type, 
  Move, 
  RotateCcw, 
  Trash2,
  Settings,
  Palette
} from 'lucide-react';

interface DrawingTool {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'text' | 'measure';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
}

const TradingTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [drawings, setDrawings] = useState<DrawingTool[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [showSettings, setShowSettings] = useState(false);

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const addDrawing = (type: DrawingTool['type'], x: number, y: number) => {
    const newDrawing: DrawingTool = {
      id: Date.now().toString(),
      type,
      x,
      y,
      width: type === 'rectangle' ? 100 : undefined,
      height: type === 'rectangle' ? 60 : undefined,
      text: type === 'text' ? 'Sample Text' : undefined,
      color: selectedColor
    };
    setDrawings([...drawings, newDrawing]);
  };

  const deleteDrawing = (id: string) => {
    setDrawings(drawings.filter(d => d.id !== id));
  };

  const clearAll = () => {
    setDrawings([]);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'select') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addDrawing(activeTool as DrawingTool['type'], x, y);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Trading Tools</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={clearAll}
            className="p-2 rounded bg-red-600 text-white hover:bg-red-700"
            title="Clear All"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Drawing Tools</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                className={`p-2 rounded ${activeTool === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                onClick={() => setActiveTool('select')}
                title="Select Tool"
              >
                <Move className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded ${activeTool === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                onClick={() => setActiveTool('line')}
                title="Line Tool"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded ${activeTool === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                onClick={() => setActiveTool('rectangle')}
                title="Rectangle Tool"
              >
                <Square className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded ${activeTool === 'circle' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                onClick={() => setActiveTool('circle')}
                title="Circle Tool"
              >
                <Circle className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded ${activeTool === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                onClick={() => setActiveTool('text')}
                title="Text Tool"
              >
                <Type className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded ${activeTool === 'measure' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                onClick={() => setActiveTool('measure')}
                title="Measure Tool"
              >
                <Ruler className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Color Palette</h4>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded border-2 ${selectedColor === color ? 'border-white' : 'border-gray-600'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {showSettings && (
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium mb-2">Tool Settings</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Snap to Grid</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Show Measurements</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chart Canvas</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button className="p-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                  <Palette className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div 
              className="bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg h-96 relative cursor-crosshair"
              onClick={handleCanvasClick}
            >
              {drawings.map((drawing) => (
                <div
                  key={drawing.id}
                  className="absolute"
                  style={{
                    left: drawing.x,
                    top: drawing.y,
                    color: drawing.color
                  }}
                >
                  {drawing.type === 'line' && (
                    <div className="w-20 h-0.5 bg-current" />
                  )}
                  {drawing.type === 'rectangle' && (
                    <div 
                      className="border-2 border-current"
                      style={{ 
                        width: drawing.width, 
                        height: drawing.height 
                      }}
                    />
                  )}
                  {drawing.type === 'circle' && (
                    <div 
                      className="border-2 border-current rounded-full"
                      style={{ 
                        width: drawing.width, 
                        height: drawing.height 
                      }}
                    />
                  )}
                  {drawing.type === 'text' && (
                    <span className="text-sm">{drawing.text}</span>
                  )}
                  {drawing.type === 'measure' && (
                    <div className="flex items-center space-x-1">
                      <div className="w-16 h-0.5 bg-current" />
                      <span className="text-xs">100px</span>
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDrawing(drawing.id);
                    }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {drawings.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">Click to add drawings</p>
                    <p className="text-sm">Select a tool from the left panel</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Technical Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Moving Averages</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">SMA 20</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">EMA 50</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">SMA 200</span>
              </label>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Oscillators</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">RSI</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">MACD</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Stochastic</span>
              </label>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Volume</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Volume Bars</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">OBV</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">VWAP</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingTools;
