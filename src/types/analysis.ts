export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface BallTrackingData {
  frame: number;
  timestamp: number;
  position: Position;
  velocity: Velocity;
  confidence: number;
}

export interface LBWPrediction {
  probability: number;
  impactPoint: Position;
  wouldHitStumps: boolean;
}

export interface AnalysisResults {
  speed: number;
  maxSpeed: number;
  pitchPoint: Position;
  pitchDistance: number;
  swingAngle: number;
  spinRate: number;
  ballType: 'inswinger' | 'outswinger' | 'straight' | 'yorker' | 'bouncer';
  lbwPrediction: LBWPrediction;
  trajectory: Position[];
}

export interface CommentaryData {
  timestamp: number;
  text: string;
  type: 'analysis' | 'prediction' | 'highlight';
}