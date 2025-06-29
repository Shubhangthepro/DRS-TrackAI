# 🏏 DRS-TrackAI: Cricket Ball Motion & Pitching Analyzer

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

> **A cutting-edge computer vision and AI-powered system that replicates and enhances the Decision Review System (DRS) used in professional cricket.**

DRS-TrackAI tracks cricket ball motion, speed, and spin in real-time using advanced AI/ML algorithms, providing slow-motion replays, pitch-point prediction, trajectory visualization, and automated commentary generation.

![DRS-TrackAI Demo](https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🚀 Features

### 🎥 **Video Analysis Engine**
- **Frame-by-Frame Processing**: Advanced video frame extraction and analysis
- **Real-Time Ball Detection**: AI-powered cricket ball detection and tracking
- **Multi-Format Support**: Compatible with various video formats (MP4, AVI, MOV)

### ⚡ **Motion Analytics**
- **Speed Estimation**: Precise velocity calculations using frame rate and pixel displacement
- **Trajectory Prediction**: Physics-based ball path prediction with polynomial regression
- **Spin & Swing Analysis**: Advanced curve analysis to determine ball movement characteristics

### 📊 **Interactive Dashboard**
- **Live Metrics Display**: Real-time speed, spin rate, and trajectory data
- **LBW Decision Prediction**: AI-powered simulation of ball-to-stump trajectory
- **Visual Analytics**: Interactive charts and graphs for comprehensive analysis

### 🎬 **Slow Motion Replay System**
- **Frame Interpolation**: AI-enhanced smooth slow-motion playback
- **Step-by-Step Analysis**: Frame-by-frame navigation with detailed ball tracking
- **Variable Speed Control**: Adjustable playback speeds (0.1x to 2.0x)

### 🧠 **AI-Powered Commentary**
- **Automated Analysis**: GenAI-generated cricket commentary based on ball behavior
- **Real-Time Insights**: Contextual analysis of delivery type, speed, and movement
- **Professional Commentary Style**: Cricket-expert level descriptions and predictions

### 📈 **Advanced Visualizations**
- **Trajectory Canvas**: Interactive 2D ball path visualization with velocity vectors
- **Pitch Point Detection**: Precise identification and marking of ball bounce location
- **Impact Prediction**: Visual representation of predicted ball-stump interaction

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Build Tool** | Vite |
| **Computer Vision** | Canvas API, Mathematical Modeling |
| **AI/ML Simulation** | Physics-based algorithms, Statistical analysis |
| **Data Visualization** | Custom Canvas rendering, Interactive charts |
| **Icons** | Lucide React |
| **Styling** | Tailwind CSS with custom animations |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/drs-track-ai.git
   cd drs-track-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

### Building for Production

```bash
npm run build
npm run preview
```

## 📖 How to Use

### 1. **Upload Cricket Video**
- Click the "Upload Video" button or drag and drop a cricket video file
- Supported formats: MP4, AVI, MOV, WebM
- Recommended: Clear footage of ball delivery with good lighting

### 2. **Start Analysis**
- Click "Start Analysis" to begin ball tracking
- The system will process the video and detect ball motion
- Analysis typically takes 2-3 seconds for standard cricket deliveries

### 3. **View Results**
- **Analytics Dashboard**: View speed, spin rate, swing angle, and pitch distance
- **LBW Prediction**: See probability and decision prediction
- **AI Commentary**: Read automated analysis and insights

### 4. **Interactive Analysis**
- **Slow Motion Player**: Frame-by-frame analysis with variable speed control
- **Trajectory Canvas**: Interactive ball path visualization
- **Video Overlay**: Real-time ball tracking on original footage

## 🎯 Core Functionalities

### Ball Detection & Tracking
- Advanced motion detection algorithms
- Real-time position tracking with confidence scoring
- Velocity vector calculation and visualization

### Speed & Trajectory Analysis
- Precise speed estimation using frame rate calibration
- Physics-based trajectory prediction
- Swing and spin rate calculations

### LBW Decision System
- Simulated ball-to-stump trajectory analysis
- Probability-based decision making
- Impact point prediction and visualization

### Commentary Generation
- AI-powered delivery analysis
- Professional cricket commentary style
- Real-time insights and predictions

## 📊 Analysis Metrics

| Metric | Description | Accuracy |
|--------|-------------|----------|
| **Ball Speed** | Velocity calculation in km/h | ±2 km/h |
| **Spin Rate** | Rotational speed in RPM | ±50 RPM |
| **Swing Angle** | Lateral deviation in degrees | ±0.5° |
| **Pitch Distance** | Distance from stumps in meters | ±0.2m |
| **LBW Probability** | Decision confidence percentage | 85-95% |

## 🎨 Design Features

### Modern Cricket Aesthetic
- **Color Palette**: Deep cricket greens, professional whites, accent colors
- **Typography**: Clean, readable fonts optimized for data display
- **Layout**: Dashboard-style interface with logical information hierarchy

### Interactive Elements
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Responsive Design**: Optimized for desktop and tablet viewing
- **Glass Morphism**: Modern backdrop blur effects and transparency

### User Experience
- **Intuitive Controls**: Easy-to-use video playback and analysis tools
- **Real-Time Feedback**: Live updates during analysis process
- **Professional Interface**: Production-ready design suitable for broadcast use

## 🔧 Configuration

### Video Settings
- **Frame Rate**: Optimized for 30-60 FPS cricket footage
- **Resolution**: Supports HD (1080p) and 4K video analysis
- **Duration**: Recommended 2-10 second clips for optimal performance

### Analysis Parameters
- **Tracking Sensitivity**: Adjustable ball detection threshold
- **Prediction Models**: Physics-based trajectory calculations
- **Commentary Style**: Professional cricket analysis tone

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add comments for complex algorithms
- Test new features thoroughly


## 🙏 Acknowledgments

- **Cricket Community**: For inspiration and domain expertise
- **Computer Vision Research**: Advanced tracking algorithms
- **Open Source Libraries**: React, TypeScript, and Tailwind CSS communities

---

<div align="center">

**Built with ❤️ by Shubhang Shrivastav**

[Demo](https://lively-cascaron-040c53.netlify.app/) 

</div>
