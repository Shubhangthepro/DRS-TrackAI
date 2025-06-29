import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Loader2, Target } from 'lucide-react';
import { BallTrackingData } from '../types/analysis';

interface VideoProcessorProps {
  videoFile: File | null;
  isProcessing: boolean;
  onStartAnalysis: () => void;
  trackingData: BallTrackingData[];
}

const VideoProcessor: React.FC<VideoProcessorProps> = ({
  videoFile,
  isProcessing,
  onStartAnalysis,
  trackingData
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoUrl]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const drawTrackingOverlay = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || trackingData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball trajectory
    const currentFrame = Math.floor((currentTime / duration) * trackingData.length);
    const currentData = trackingData[currentFrame];

    if (currentData) {
      // Draw ball position
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(currentData.position.x, currentData.position.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw trajectory trail
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const startFrame = Math.max(0, currentFrame - 10);
      for (let i = startFrame; i <= currentFrame; i++) {
        const data = trackingData[i];
        if (data) {
          if (i === startFrame) {
            ctx.moveTo(data.position.x, data.position.y);
          } else {
            ctx.lineTo(data.position.x, data.position.y);
          }
        }
      }
      ctx.stroke();

      // Draw velocity vector
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentData.position.x, currentData.position.y);
      ctx.lineTo(
        currentData.position.x + currentData.velocity.x * 5,
        currentData.position.y + currentData.velocity.y * 5
      );
      ctx.stroke();

      // Draw arrowhead
      const angle = Math.atan2(currentData.velocity.y, currentData.velocity.x);
      const headLength = 10;
      ctx.beginPath();
      ctx.moveTo(
        currentData.position.x + currentData.velocity.x * 5,
        currentData.position.y + currentData.velocity.y * 5
      );
      ctx.lineTo(
        currentData.position.x + currentData.velocity.x * 5 - headLength * Math.cos(angle - Math.PI / 6),
        currentData.position.y + currentData.velocity.y * 5 - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(
        currentData.position.x + currentData.velocity.x * 5,
        currentData.position.y + currentData.velocity.y * 5
      );
      ctx.lineTo(
        currentData.position.x + currentData.velocity.x * 5 - headLength * Math.cos(angle + Math.PI / 6),
        currentData.position.y + currentData.velocity.y * 5 - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawTrackingOverlay();
  }, [currentTime, trackingData]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Video Analysis</h2>
        {!isProcessing && trackingData.length === 0 && (
          <button
            onClick={onStartAnalysis}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>Start Analysis</span>
          </button>
        )}
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-white">Analyzing ball motion...</p>
            <div className="w-64 bg-white/20 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}

      {videoUrl && !isProcessing && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              onLoadedMetadata={() => {
                const video = videoRef.current;
                if (video) {
                  setDuration(video.duration);
                }
              }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-1" />
              )}
            </button>

            <div className="flex-1 flex items-center space-x-3">
              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-white text-sm font-mono">
                {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={() => {
                const video = videoRef.current;
                if (video) {
                  video.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProcessor;