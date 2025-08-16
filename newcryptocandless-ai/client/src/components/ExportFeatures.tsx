import React, { useState } from 'react';
import { 
  Download, 
  Image, 
  FileText, 
  Share2, 
  Copy,
  CheckCircle,
  XCircle,
  Settings,
  Calendar,
  BarChart3,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality: number;
  width: number;
  height: number;
  includeVolume: boolean;
  includeIndicators: boolean;
  includeDrawings: boolean;
  backgroundColor: string;
  watermark: boolean;
}

interface DataExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  dateRange: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'all';
  includeOHLC: boolean;
  includeVolume: boolean;
  includeIndicators: boolean;
  includeCalculations: boolean;
}

interface ExportFeaturesProps {
  onExport: (options: ExportOptions) => void;
  onDataExport: (options: DataExportOptions) => void;
  chartData?: any[];
  volumeData?: any[];
}

const ExportFeatures: React.FC<ExportFeaturesProps> = ({ 
  onExport, 
  onDataExport, 
  chartData = [], 
  volumeData = [] 
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 90,
    width: 1920,
    height: 1080,
    includeVolume: true,
    includeIndicators: true,
    includeDrawings: true,
    backgroundColor: '#1a1a1a',
    watermark: false
  });

  const [dataExportOptions, setDataExportOptions] = useState<DataExportOptions>({
    format: 'csv',
    dateRange: '1m',
    includeOHLC: true,
    includeVolume: true,
    includeIndicators: false,
    includeCalculations: false
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isDataExporting, setIsDataExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChartExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportOptions);
      // Simulate export delay
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      setIsExporting(false);
      console.error('Export failed:', error);
    }
  };

  const handleDataExport = async () => {
    setIsDataExporting(true);
    try {
      await onDataExport(dataExportOptions);
      // Simulate export delay
      setTimeout(() => {
        setIsDataExporting(false);
      }, 1500);
    } catch (error) {
      setIsDataExporting(false);
      console.error('Data export failed:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      chart: 'true',
      symbol: 'AAPL', // This would be dynamic
      timeframe: '1d'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const shareLink = generateShareLink();

  const formatOptions = [
    { value: 'png', label: 'PNG', icon: Image, description: 'High quality, transparent background' },
    { value: 'jpg', label: 'JPEG', icon: Image, description: 'Good quality, smaller file size' },
    { value: 'svg', label: 'SVG', icon: Image, description: 'Vector format, scalable' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Document format, printable' }
  ];

  const dataFormats = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Excel compatible' },
    { value: 'json', label: 'JSON', icon: FileText, description: 'Structured data format' },
    { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, description: 'Native Excel format' }
  ];

  const dateRanges = [
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' },
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Data' }
  ];

  return (
    <div className="space-y-6">
      {/* Chart Export */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Image className="w-5 h-5 mr-2" />
            Export Chart
          </h3>
          <button
            onClick={handleChartExport}
            disabled={isExporting}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 rounded text-white transition-colors flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Chart</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format Options */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Export Format</h4>
            <div className="space-y-2">
              {formatOptions.map((format) => (
                <label key={format.value} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors">
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={exportOptions.format === format.value}
                    onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value as any })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 focus:ring-primary-500"
                  />
                  <format.icon className="w-5 h-5 text-dark-400" />
                  <div>
                    <div className="text-white font-medium">{format.label}</div>
                    <div className="text-xs text-dark-400">{format.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Settings */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Export Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-dark-400 mb-1">Quality</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={exportOptions.quality}
                  onChange={(e) => setExportOptions({ ...exportOptions, quality: parseInt(e.target.value) })}
                  className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-xs text-dark-400 mt-1">{exportOptions.quality}%</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Width</label>
                  <input
                    type="number"
                    value={exportOptions.width}
                    onChange={(e) => setExportOptions({ ...exportOptions, width: parseInt(e.target.value) })}
                    className="input-field w-full"
                    min="800"
                    max="4000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Height</label>
                  <input
                    type="number"
                    value={exportOptions.height}
                    onChange={(e) => setExportOptions({ ...exportOptions, height: parseInt(e.target.value) })}
                    className="input-field w-full"
                    min="600"
                    max="3000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeVolume}
                    onChange={(e) => setExportOptions({ ...exportOptions, includeVolume: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">Include Volume</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeIndicators}
                    onChange={(e) => setExportOptions({ ...exportOptions, includeIndicators: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">Include Indicators</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeDrawings}
                    onChange={(e) => setExportOptions({ ...exportOptions, includeDrawings: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">Include Drawings</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.watermark}
                    onChange={(e) => setExportOptions({ ...exportOptions, watermark: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">Add Watermark</span>
                </label>
              </div>

              <div>
                <label className="block text-xs text-dark-400 mb-1">Background Color</label>
                <input
                  type="color"
                  value={exportOptions.backgroundColor}
                  onChange={(e) => setExportOptions({ ...exportOptions, backgroundColor: e.target.value })}
                  className="w-full h-10 rounded border border-dark-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Export Data
          </h3>
          <button
            onClick={handleDataExport}
            disabled={isDataExporting}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 rounded text-white transition-colors flex items-center space-x-2"
          >
            {isDataExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Format */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Data Format</h4>
            <div className="space-y-2">
              {dataFormats.map((format) => (
                <label key={format.value} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors">
                  <input
                    type="radio"
                    name="dataFormat"
                    value={format.value}
                    checked={dataExportOptions.format === format.value}
                    onChange={(e) => setDataExportOptions({ ...dataExportOptions, format: e.target.value as any })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 focus:ring-primary-500"
                  />
                  <format.icon className="w-5 h-5 text-dark-400" />
                  <div>
                    <div className="text-white font-medium">{format.label}</div>
                    <div className="text-xs text-dark-400">{format.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Data Options */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Data Options</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-dark-400 mb-1">Date Range</label>
                <select
                  value={dataExportOptions.dateRange}
                  onChange={(e) => setDataExportOptions({ ...dataExportOptions, dateRange: e.target.value as any })}
                  className="input-field w-full"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={dataExportOptions.includeOHLC}
                    onChange={(e) => setDataExportOptions({ ...dataExportOptions, includeOHLC: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">Include OHLC Data</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={dataExportOptions.includeVolume}
                    onChange={(e) => setDataExportOptions({ ...dataExportOptions, includeVolume: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">Include Volume</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={dataExportOptions.includeIndicators}
                    onChange={(e) => setDataExportOptions({ ...dataExportOptions, includeIndicators: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">Include Indicators</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={dataExportOptions.includeCalculations}
                    onChange={(e) => setDataExportOptions({ ...dataExportOptions, includeCalculations: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">Include Calculations</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Data Preview */}
        {chartData.length > 0 && (
          <div className="mt-4 p-3 bg-dark-700 rounded-lg">
            <div className="text-sm text-dark-400 mb-2">
              Data Preview: {chartData.length} data points available
            </div>
            <div className="text-xs text-dark-500">
              Sample: {chartData.slice(0, 3).map((item, i) => 
                `${item.time}: $${item.close}`
              ).join(' | ')}
            </div>
          </div>
        )}
      </div>

      {/* Share Options */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Share2 className="w-5 h-5 mr-2" />
          Share Chart
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-dark-400 mb-2">Share Link</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="input-field flex-1"
              />
              <button
                onClick={() => copyToClipboard(shareLink)}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded text-white transition-colors flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share on Twitter</span>
            </button>
            <button className="px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded text-white transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share on LinkedIn</span>
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportFeatures;


