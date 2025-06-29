import React, { useRef, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { BallTrackingData, AnalysisResults } from '../types/analysis';

interface TrajectoryCanvasProps {
  trackingData: BallTrackingData[];
  analysisResults: AnalysisResults;
}

const TrajectoryCanvas: React.FC<TrajectoryCanvasProps> = ({ trackingData, analysisResults }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawTrajectory();
  }, [trackingData, analysisResults]);

  const drawTrajectory = () => {
    const canvas = canvasRef.current;
    if (!canvas || trackingData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Set up coordinate system
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Find bounds
    const xValues = trackingData.map(d => d.position.x);
    const yValues = trackingData.map(d => d.position.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    // Scale functions
    const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX)) * chartWidth;
    const scaleY = (y: number) => padding + ((maxY - y) / (maxY - minY)) * chartHeight;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * chartWidth;
      const y = padding + (i / 10) * chartHeight;
      
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw trajectory line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    trackingData.forEach((data, index) => {
      const x = scaleX(data.position.x);
      const y = scaleY(data.position.y);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw velocity vectors
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    
    trackingData.forEach((data, index) => {
      if (index % 5 === 0) { // Draw every 5th vector
        const x = scaleX(data.position.x);
        const y = scaleY(data.position.y);
        const vx = data.velocity.x * 2;
        const vy = data.velocity.y * 2;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx, y - vy);
        ctx.stroke();
        
        // Arrowhead
        const angle = Math.atan2(-vy, vx);
        const headLength = 8;
        ctx.beginPath();
        ctx.moveTo(x + vx, y - vy);
        ctx.lineTo(
          x + vx - headLength * Math.cos(angle - Math.PI / 6),
          y - vy - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x + vx, y - vy);
        ctx.lineTo(
          x + vx - headLength * Math.cos(angle + Math.PI / 6),
          y - vy - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    });

    // Draw pitch point
    if (analysisResults.pitchPoint) {
      const pitchX = scaleX(analysisResults.pitchPoint.x);
      const pitchY = scaleY(analysisResults.pitchPoint.y);
      
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pitchX, pitchY, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      ctx.fillText('Pitch Point', pitchX + 15, pitchY - 10);
    }

    // Draw ball positions
    trackingData.forEach((data, index) => {
      const x = scaleX(data.position.x);
      const y = scaleY(data.position.y);
      const opacity = data.confidence;
      
      ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw predicted trajectory
    if (analysisResults.lbwPrediction.impactPoint) {
      const impactX = scaleX(analysisResults.lbwPrediction.impactPoint.x);
      const impactY = scaleY(analysisResults.lbwPrediction.impactPoint.y);
      
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      const lastPoint = trackingData[trackingData.length - 1];
      if (lastPoint) {
        const lastX = scaleX(lastPoint.position.x);
        const lastY = scaleY(lastPoint.position.y);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(impactX, impactY);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
      
      // Draw impact point
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(impactX, impactY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      ctx.fillText('Predicted Impact', impactX + 15, impactY - 10);
    }

    // Draw labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText('Ball Trajectory Analysis', padding, 25);
    
    // Legend
    const legendY = height - 25;
    ctx.font = '10px sans-serif';
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(padding, legendY, 15, 3);
    ctx.fillStyle = '#fff';
    ctx.fillText('Trajectory', padding + 20, legendY + 10);
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(padding + 100, legendY, 15, 3);
    ctx.fillStyle = '#fff';
    ctx.fillText('Velocity', padding + 120, legendY + 10);
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(padding + 200 + 7, legendY + 1, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('Ball Position', padding + 215, legendY + 10);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Trajectory Visualization</span>
        </h2>
      </div>
      
      <div className="bg-gray-900/50 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-auto border border-white/20 rounded"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <p className="text-white/60">Max Speed</p>
          <p className="text-white font-semibold">{analysisResults.maxSpeed} km/h</p>
        </div>
        <div className="text-center">
          <p className="text-white/60">Swing</p>
          <p className="text-white font-semibold">{analysisResults.swingAngle}°</p>
        </div>
        <div className="text-center">
          <p className="text-white/60">Spin</p>
          <p className="text-white font-semibold">{analysisResults.spinRate} rpm</p>
        </div>
      </div>
    </div>
  );
};

export default TrajectoryCanvas;