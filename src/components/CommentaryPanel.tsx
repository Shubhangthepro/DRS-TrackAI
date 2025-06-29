import React, { useState, useEffect } from 'react';
import { MessageSquare, Volume2, Mic } from 'lucide-react';
import { AnalysisResults, CommentaryData } from '../types/analysis';

interface CommentaryPanelProps {
  analysisResults: AnalysisResults | null;
}

const CommentaryPanel: React.FC<CommentaryPanelProps> = ({ analysisResults }) => {
  const [commentary, setCommentary] = useState<CommentaryData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (analysisResults) {
      generateCommentary(analysisResults);
    }
  }, [analysisResults]);

  const generateCommentary = async (results: AnalysisResults) => {
    setIsGenerating(true);
    
    // Simulate AI commentary generation
    setTimeout(() => {
      const newCommentary: CommentaryData[] = [
        {
          timestamp: 0,
          text: `Delivery detected! ${results.ballType} at ${results.speed} km/h`,
          type: 'analysis'
        },
        {
          timestamp: 1000,
          text: `Ball pitched ${results.pitchDistance}m from the stumps with ${results.swingAngle}° of movement`,
          type: 'analysis'
        },
        {
          timestamp: 2000,
          text: `Impressive spin rate of ${results.spinRate} RPM - that's some serious turn!`,
          type: 'highlight'
        },
        {
          timestamp: 3000,
          text: `LBW Appeal: ${results.lbwPrediction.wouldHitStumps ? 'OUT' : 'NOT OUT'} - ${(results.lbwPrediction.probability * 100).toFixed(1)}% confidence`,
          type: results.lbwPrediction.wouldHitStumps ? 'prediction' : 'analysis'
        }
      ];

      // Add ball type specific commentary
      if (results.ballType === 'inswinger') {
        newCommentary.push({
          timestamp: 4000,
          text: "Beautiful inswinger! The ball is curving in sharply towards the batsman's pads.",
          type: 'highlight'
        });
      } else if (results.ballType === 'outswinger') {
        newCommentary.push({
          timestamp: 4000,
          text: "Classic outswinger! Moving away from the right-handed batsman.",
          type: 'highlight'
        });
      }

      setCommentary(newCommentary);
      setIsGenerating(false);
    }, 2000);
  };

  const getCommentaryTypeColor = (type: CommentaryData['type']) => {
    switch (type) {
      case 'analysis': return 'text-blue-300';
      case 'prediction': return 'text-yellow-300';
      case 'highlight': return 'text-green-300';
      default: return 'text-white';
    }
  };

  const getCommentaryTypeIcon = (type: CommentaryData['type']) => {
    switch (type) {
      case 'analysis': return '📊';
      case 'prediction': return '🎯';
      case 'highlight': return '⭐';
      default: return '💬';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>AI Commentary</span>
        </h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <Volume2 className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <Mic className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {isGenerating && (
          <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span className="text-white/60">Generating commentary...</span>
          </div>
        )}

        {commentary.map((comment, index) => (
          <div 
            key={index} 
            className="p-4 bg-white/5 rounded-lg border-l-4 border-blue-400 animate-fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{getCommentaryTypeIcon(comment.type)}</span>
              <div className="flex-1">
                <p className={`${getCommentaryTypeColor(comment.type)} font-medium`}>
                  {comment.text}
                </p>
                <p className="text-white/40 text-xs mt-1">
                  {(comment.timestamp / 1000).toFixed(1)}s
                </p>
              </div>
            </div>
          </div>
        ))}

        {!isGenerating && commentary.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">Upload and analyze a video to see AI commentary</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {analysisResults && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-sm font-medium text-white/80 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/60 text-xs">Ball Type</p>
              <p className="text-white font-medium capitalize">{analysisResults.ballType}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/60 text-xs">Decision</p>
              <p className={`font-medium ${analysisResults.lbwPrediction.wouldHitStumps ? 'text-red-400' : 'text-green-400'}`}>
                {analysisResults.lbwPrediction.wouldHitStumps ? 'OUT' : 'NOT OUT'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentaryPanel;