import React from 'react';
import { Zap, Target, RotateCcw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { AnalysisResults } from '../types/analysis';

interface AnalyticsDashboardProps {
  results: AnalysisResults;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ results }) => {
  const metrics = [
    {
      icon: Zap,
      label: 'Ball Speed',
      value: `${results.speed} km/h`,
      sublabel: `Max: ${results.maxSpeed} km/h`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    },
    {
      icon: Target,
      label: 'Pitch Distance',
      value: `${results.pitchDistance}m`,
      sublabel: 'From stumps',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      icon: RotateCcw,
      label: 'Spin Rate',
      value: `${results.spinRate} rpm`,
      sublabel: results.ballType,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      icon: TrendingUp,
      label: 'Swing Angle',
      value: `${results.swingAngle}°`,
      sublabel: 'Deviation',
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Analysis Results</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4">
            <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center mb-3`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <h3 className="text-white font-medium mb-1">{metric.label}</h3>
            <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
            <p className="text-sm text-white/60">{metric.sublabel}</p>
          </div>
        ))}
      </div>

      {/* LBW Prediction */}
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">LBW Decision Prediction</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            results.lbwPrediction.wouldHitStumps 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-green-500/20 text-green-400'
          }`}>
            {results.lbwPrediction.wouldHitStumps ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span className="font-medium">
              {results.lbwPrediction.wouldHitStumps ? 'OUT' : 'NOT OUT'}
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Probability</p>
            <p className="text-white font-semibold">
              {(results.lbwPrediction.probability * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Impact Point</p>
            <p className="text-white font-semibold">
              ({results.lbwPrediction.impactPoint.x}, {results.lbwPrediction.impactPoint.y})
            </p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Confidence</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${results.lbwPrediction.probability * 100}%` }}
                ></div>
              </div>
              <span className="text-white text-sm">
                {(results.lbwPrediction.probability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;