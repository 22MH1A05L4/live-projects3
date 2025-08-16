import React from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, Loader2, Zap, Target, BarChart3 } from 'lucide-react';

interface AIAnalysis {
  summary: string;
  recommendation: string;
  rationale: string;
  confidence: number;
}

interface AIAnalysisPanelProps {
  symbol: string;
  data: any[];
  onAnalyze: () => void;
  analysis: AIAnalysis | null;
  isLoading: boolean;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ 
  symbol, 
  data, 
  onAnalyze, 
  analysis, 
  isLoading 
}) => {
  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return <TrendingUp className="w-5 h-5 text-success-500" />;
      case 'SELL':
        return <TrendingDown className="w-5 h-5 text-danger-500" />;
      case 'HOLD':
        return <Minus className="w-5 h-5 text-warning-500" />;
      default:
        return <Minus className="w-5 h-5 text-dark-400" />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'text-success-500';
      case 'SELL':
        return 'text-danger-500';
      case 'HOLD':
        return 'text-warning-500';
      default:
        return 'text-dark-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success-500';
    if (confidence >= 60) return 'text-warning-500';
    return 'text-danger-500';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Brain className="w-5 h-5 mr-2 text-primary-500" />
          AI Analysis
        </h3>
        <button
          onClick={onAnalyze}
          disabled={isLoading || data.length === 0}
          className="btn-primary text-sm px-3 py-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {!analysis && !isLoading && (
        <div className="text-center py-8 text-dark-400">
          <Target className="w-12 h-12 mx-auto mb-3 text-dark-600" />
          <p>Click "Analyze" to get AI-powered insights</p>
          <p className="text-sm mt-1">Requires chart data to analyze</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
          <p className="text-dark-400">AI is analyzing {symbol}...</p>
          <p className="text-sm text-dark-500">This may take a few seconds</p>
        </div>
      )}

      {analysis && !isLoading && (
        <div className="space-y-4">
          {/* Recommendation */}
          <div className="bg-dark-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-dark-300">Recommendation</span>
              {getRecommendationIcon(analysis.recommendation)}
            </div>
            <div className={`text-xl font-bold ${getRecommendationColor(analysis.recommendation)}`}>
              {analysis.recommendation}
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-dark-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-dark-300">Confidence</span>
              <BarChart3 className="w-4 h-4 text-primary-500" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-dark-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getConfidenceColor(analysis.confidence)}`}
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${getConfidenceColor(analysis.confidence)}`}>
                {analysis.confidence}%
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-dark-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-dark-300 mb-2">Summary</h4>
            <p className="text-white text-sm leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Rationale */}
          <div className="bg-dark-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-dark-300 mb-2">Rationale</h4>
            <p className="text-white text-sm leading-relaxed">
              {analysis.rationale}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-dark-500 text-center p-3 bg-dark-800 rounded-lg">
            <p>⚠️ This analysis is for informational purposes only.</p>
            <p>Always do your own research before making investment decisions.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;


