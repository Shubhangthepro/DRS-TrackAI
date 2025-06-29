import React, { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react';
import { BallTrackingData } from '../types/analysis';

interface SlowMotionPlayerProps {
  videoFile: File | null;
  trackingData: BallTrackingData[];
}

const SlowMotionPlayer: React.FC<SlowMotionPlayerProps> = ({ videoFile, trackingData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.25);
  const [currentFrame, setCurrentFrame] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playbackSpeeds = [0.1, 0.25, 0.5, 1.0, 2.0];

  const togglePlayPause = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      intervalRef.current = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= trackingData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, (1000 / 60) / playbackSpeed);
    }
    setIsPlaying(!isPlaying);
  };

  const stepFrame = (direction: 'forward' | 'backward') => {
    setCurrentFrame(prev => {
      if (direction === 'forward') {
        return Math.min(prev + 1, trackingData.length - 1);
      } else {
        return Math.max(prev - 1, 0);
      }
    });
  };

  const resetToStart = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= trackingData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, (1000 / 60) / playbackSpeed);
    }
  }, [playbackSpeed, isPlaying, trackingData.length]);

  const currentData = trackingData[currentFrame];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Slow Motion Analysis</h2>
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm">Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-white/20 text-white px-3 py-1 rounded text-sm"
          >
            {playbackSpeeds.map(speed => (
              <option key={speed} value={speed} className="bg-gray-800">
                {speed}x
              </option>
            ))}
          </select>
        </div>
      </div>

      {trackingData.length > 0 ? (
        <div className="space-y-6">
          {/* Frame Display */}
          <div className="bg-gray-900/50 rounded-lg p-8 text-center">
            <div className="mb-4">
              <div className="text-4xl font-mono text-white mb-2">
                Frame {currentFrame + 1}/{trackingData.length}
              </div>
              <div className="text-white/60">
                {currentData && `${currentData.timestamp.toFixed(1)}ms`}
              </div>
            </div>

            {/* Ball Visualization */}
            {currentData && (
              <div className="relative w-full h-48 bg-green-800/30 rounded-lg overflow-hidden">
                <div 
                  className="absolute w-4 h-4 bg-red-500 rounded-full transition-all duration-75"
                  style={{
                    left: `${(currentData.position.x / 800) * 100}%`,
                    top: `${(currentData.position.y / 400) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                
                {/* Velocity Vector */}
                <div
                  className="absolute w-0.5 bg-blue-400 transition-all duration-75"
                  style={{
                    left: `${(currentData.position.x / 800) * 100}%`,
                    top: `${(currentData.position.y / 400) * 100}%`,
                    height: `${Math.sqrt(currentData.velocity.x ** 2 + currentData.velocity.y ** 2) * 2}px`,
                    transform: `translate(-50%, -50%) rotate(${Math.atan2(currentData.velocity.y, currentData.velocity.x) * 180 / Math.PI}deg)`,
                    transformOrigin: 'center top'
                  }}
                />

                {/* Trail */}
                {trackingData.slice(Math.max(0, currentFrame - 10), currentFrame).map((data, i, arr) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-500 rounded-full"
                    style={{
                      left: `${(data.position.x / 800) * 100}%`,
                      top: `${(data.position.y / 400) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      opacity: (i + 1) / arr.length * 0.7
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={resetToStart}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Rewind className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={() => stepFrame('backward')}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <SkipBack className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </button>
              
              <button
                onClick={() => stepFrame('forward')}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={() => setCurrentFrame(trackingData.length - 1)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <FastForward className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={trackingData.length - 1}
                value={currentFrame}
                onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-white/60 text-xs">
                <span>0</span>
                <span>{trackingData.length - 1}</span>
              </div>
            </div>
          </div>

          {/* Current Frame Data */}
          {currentData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs">Position X</p>
                <p className="text-white font-mono">{currentData.position.x.toFixed(1)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs">Position Y</p>
                <p className="text-white font-mono">{currentData.position.y.toFixed(1)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs">Velocity</p>
                <p className="text-white font-mono">
                  {Math.sqrt(currentData.velocity.x ** 2 + currentData.velocity.y ** 2).toFixed(1)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs">Confidence</p>
                <p className="text-white font-mono">{(currentData.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Play className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <p className="text-white/60">Analyze a video to see slow motion playback</p>
        </div>
      )}
    </div>
  );
};

export default SlowMotionPlayer;