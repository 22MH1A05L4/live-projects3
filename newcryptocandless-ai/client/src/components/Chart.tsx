import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, HistogramData, Time } from 'lightweight-charts';
import { Loader2, BarChart3, Maximize2, Download, Share2 } from 'lucide-react';

interface ChartProps {
  symbol: string;
  data: any[];
  volumeData: HistogramData[];
  isLoading: boolean;
  selectedType: 'stock' | 'crypto';
}

const Chart: React.FC<ChartProps> = ({ symbol, data, volumeData, isLoading, selectedType }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const isDisposedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (!data || data.length === 0) {
        return;
    }

    // Clean up previous chart if it exists
    if (chartRef.current && !isDisposedRef.current) {
      try {
        chartRef.current.remove();
        isDisposedRef.current = true;
      } catch (error) {
        console.warn('Chart already disposed:', error);
      }
      chartRef.current = null;
    }
    
    // Reset disposed flag for new chart
    isDisposedRef.current = false;

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#1f2937' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    // Ensure data is properly formatted
    const formattedData = data.map(item => ({
      ...item,
      time: typeof item.time === 'number' ? item.time : Math.floor(new Date(String(item.time)).getTime() / 1000)
    }));

    const formattedVolumeData = volumeData.map(item => ({
      ...item,
      time: typeof item.time === 'number' ? item.time : Math.floor(new Date(String(item.time)).getTime() / 1000)
    }));

    // Set data
    candlestickSeries.setData(formattedData);
    volumeSeries.setData(formattedVolumeData as HistogramData[]);

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    chartRef.current = chart;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current && !isDisposedRef.current) {
        try {
          chartRef.current.remove();
          isDisposedRef.current = true;
        } catch (error) {
          console.warn('Chart cleanup error:', error);
        }
        chartRef.current = null;
      }
    };
  }, [data, volumeData]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      if (chartRef.current && !isDisposedRef.current) {
        try {
          chartRef.current.remove();
          isDisposedRef.current = true;
        } catch (error) {
          console.warn('Component unmount cleanup error:', error);
        }
        chartRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-3 text-white">Loading chart data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 text-center">
        <BarChart3 className="w-16 h-16 text-dark-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Chart Data</h3>
        <p className="text-dark-400">Select a symbol to view the chart</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{symbol}</h3>
          <p className="text-sm text-dark-400 capitalize">{selectedType} Chart</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-dark-400 hover:text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-dark-400 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-dark-400 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-96" />
    </div>
  );
};

export default Chart;
