import React, { useState, useRef, useCallback } from 'react';
import { Play, Pause, Upload, Target, Zap, RotateCcw, TrendingUp, AlertCircle } from 'lucide-react';
import VideoProcessor from './components/VideoProcessor';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CommentaryPanel from './components/CommentaryPanel';
import TrajectoryCanvas from './components/TrajectoryCanvas';
import SlowMotionPlayer from './components/SlowMotionPlayer';
import { BallTrackingData, AnalysisResults } from './types/analysis';

function App() {
  const [currentView, setCurrentView] = useState<'upload' | 'analysis'>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trackingData, setTrackingData] = useState<BallTrackingData[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setCurrentView('analysis');
    }
  }, []);

  const simulateAnalysis = useCallback(() => {
    setIsProcessing(true);
    
    // Simulate ball tracking data
    setTimeout(() => {
      const mockTrackingData: BallTrackingData[] = Array.from({ length: 60 }, (_, i) => ({
        frame: i,
        timestamp: i * 16.67, // 60fps
        position: {
          x: 100 + i * 8 + Math.sin(i * 0.1) * 20,
          y: 300 - i * 2 + Math.cos(i * 0.15) * 15
        },
        velocity: {
          x: 8 + Math.random() * 2,
          y: -2 + Math.random() * 4
        },
        confidence: 0.85 + Math.random() * 0.15
      }));

      const mockResults: AnalysisResults = {
        speed: 142.5,
        maxSpeed: 145.2,
        pitchPoint: { x: 420, y: 280 },
        pitchDistance: 6.8,
        swingAngle: 2.3,
        spinRate: 1850,
        ballType: 'inswinger',
        lbwPrediction: {
          probability: 0.73,
          impactPoint: { x: 500, y: 275 },
          wouldHitStumps: true
        },
        trajectory: mockTrackingData.map(d => d.position)
      };

      setTrackingData(mockTrackingData);
      setAnalysisResults(mockResults);
      setIsProcessing(false);
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-800" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DRS-TrackAI</h1>
                <p className="text-green-100 text-sm">Cricket Ball Motion & Pitching Analyzer</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Video</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {currentView === 'upload' ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Advanced Cricket Ball Analysis
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Upload cricket footage to analyze ball motion, speed, trajectory, and make LBW predictions with AI-powered precision
              </p>
            </div>

            {/* Upload Zone */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border-2 border-dashed border-white/30 p-12 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Upload Cricket Video</h3>
                <p className="text-green-100">
                  Drop your cricket video here or click to browse
                </p>
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
              >
                Choose Video File
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { icon: Target, title: 'Ball Tracking', desc: 'Real-time detection and path analysis' },
                { icon: Zap, title: 'Speed Analysis', desc: 'Precise velocity measurements' },
                { icon: RotateCcw, title: 'Spin Detection', desc: 'Analyze rotation and swing' },
                { icon: TrendingUp, title: 'Trajectory Prediction', desc: 'Predict ball path and LBW' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                  <feature.icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-green-100 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Video Processing Section */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <VideoProcessor
                  videoFile={videoFile}
                  isProcessing={isProcessing}
                  onStartAnalysis={simulateAnalysis}
                  trackingData={trackingData}
                />
              </div>
              <div>
                <CommentaryPanel analysisResults={analysisResults} />
              </div>
            </div>

            {/* Analysis Results */}
            {analysisResults && (
              <>
                <AnalyticsDashboard results={analysisResults} />
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <TrajectoryCanvas 
                    trackingData={trackingData}
                    analysisResults={analysisResults}
                  />
                  <SlowMotionPlayer
                    videoFile={videoFile}
                    trackingData={trackingData}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;