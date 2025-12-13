import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * AnnealingSim - Configuration Constraint Visualization (Enhanced)
 * 
 * Demonstrates: "What cannot be configured cannot be thought"
 * 
 * Features:
 * - Energy landscape with PHYSIOLOGICAL basins (autonomic states)
 * - Temperature/PRECISION slider (high precision = trapped, low = flexible)
 * - QUENCH button simulating trauma (rapid cooling → frozen state)
 * - DUAL VISUALIZATION: energy landscape + bodily state indicators
 */

// Physiological basins based on autonomic states
const BASIN_TYPES = [
  { 
    id: 'ventral', 
    label: 'Ventral Vagal', 
    subtitle: 'Safe & Social',
    color: '#4ade80', 
    depth: 0.7,
    bodyState: {
      heartRate: 65,
      muscleTension: 0.2,
      breathingRate: 12,
      cognitiveAccess: 0.95,
      description: 'Calm, connected, full cognitive flexibility'
    }
  },
  { 
    id: 'sympathetic', 
    label: 'Sympathetic', 
    subtitle: 'Fight / Flight',
    color: '#f87171', 
    depth: 1.0,
    bodyState: {
      heartRate: 110,
      muscleTension: 0.8,
      breathingRate: 22,
      cognitiveAccess: 0.4,
      description: 'Mobilized, threat-focused, narrowed attention'
    }
  },
  { 
    id: 'dorsal', 
    label: 'Dorsal Vagal', 
    subtitle: 'Shutdown',
    color: '#64748b', 
    depth: 1.2,
    bodyState: {
      heartRate: 55,
      muscleTension: 0.1,
      breathingRate: 8,
      cognitiveAccess: 0.15,
      description: 'Collapsed, dissociated, minimal cognitive access'
    }
  },
  { 
    id: 'flow', 
    label: 'Flow State', 
    subtitle: 'Engaged',
    color: '#a78bfa', 
    depth: 0.5,
    bodyState: {
      heartRate: 75,
      muscleTension: 0.3,
      breathingRate: 14,
      cognitiveAccess: 0.9,
      description: 'Absorbed, effortless action, high integration'
    }
  },
  { 
    id: 'hypervigilance', 
    label: 'Hypervigilance', 
    subtitle: 'Frozen Alert',
    color: '#fb923c', 
    depth: 0.9,
    bodyState: {
      heartRate: 95,
      muscleTension: 0.9,
      breathingRate: 18,
      cognitiveAccess: 0.25,
      description: 'Scanning, rigid, unable to settle'
    }
  },
];

function initializeBasins(width, height) {
  const cx = width / 2;
  const cy = height / 2 - 20;
  
  const positions = [
    { x: cx, y: cy - 70 },
    { x: cx + 110, y: cy + 30 },
    { x: cx, y: cy + 100 },
    { x: cx - 110, y: cy - 20 },
    { x: cx + 60, y: cy + 60 },
  ];
  
  return BASIN_TYPES.map((type, i) => ({
    ...type,
    x: positions[i].x,
    y: positions[i].y,
    radius: 45 + type.depth * 15,
  }));
}

function computeLandscape(width, height, basins, resolution = 3) {
  const cols = Math.ceil(width / resolution);
  const rows = Math.ceil(height / resolution);
  const landscape = [];
  const basinMap = [];
  
  for (let row = 0; row < rows; row++) {
    landscape[row] = [];
    basinMap[row] = [];
    
    for (let col = 0; col < cols; col++) {
      const x = col * resolution;
      const y = row * resolution;
      
      let totalEnergy = 2;
      let dominantBasin = -1;
      let maxInfluence = 0;
      
      basins.forEach((basin, idx) => {
        const dx = x - basin.x;
        const dy = y - basin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const wellDepth = basin.depth * 1.5;
        const wellWidth = basin.radius;
        const influence = wellDepth * Math.exp(-(dist * dist) / (2 * wellWidth * wellWidth));
        
        totalEnergy -= influence;
        
        if (influence > maxInfluence) {
          maxInfluence = influence;
          dominantBasin = idx;
        }
      });
      
      landscape[row][col] = Math.max(0, Math.min(1, totalEnergy / 2));
      basinMap[row][col] = maxInfluence > 0.1 ? dominantBasin : -1;
    }
  }
  
  return { landscape, basinMap, resolution, cols, rows };
}

function getForceAndEnergy(basins, x, y) {
  let fx = 0, fy = 0, energy = 2;
  
  basins.forEach(basin => {
    const dx = basin.x - x;
    const dy = basin.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    
    const wellDepth = basin.depth * 1.5;
    const wellWidth = basin.radius;
    const gaussFactor = Math.exp(-(dist * dist) / (2 * wellWidth * wellWidth));
    const gradientMag = (wellDepth * dist / (wellWidth * wellWidth)) * gaussFactor;
    
    fx += (dx / dist) * gradientMag;
    fy += (dy / dist) * gradientMag;
    energy -= wellDepth * gaussFactor;
  });
  
  return { fx, fy, energy: Math.max(0, energy) };
}

function findCurrentBasin(basins, x, y) {
  let closest = null;
  let minDist = Infinity;
  
  basins.forEach((basin, idx) => {
    const dx = basin.x - x;
    const dy = basin.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < basin.radius * 1.2 && dist < minDist) {
      minDist = dist;
      closest = { basin, index: idx, proximity: 1 - (dist / basin.radius) };
    }
  });
  
  return closest;
}

function interpolateBodyState(currentBasin, proximity, defaultState) {
  if (!currentBasin) return defaultState;
  
  const target = currentBasin.basin.bodyState;
  const t = Math.min(1, proximity * 1.5);
  
  return {
    heartRate: Math.round(defaultState.heartRate + (target.heartRate - defaultState.heartRate) * t),
    muscleTension: defaultState.muscleTension + (target.muscleTension - defaultState.muscleTension) * t,
    breathingRate: Math.round(defaultState.breathingRate + (target.breathingRate - defaultState.breathingRate) * t),
    cognitiveAccess: defaultState.cognitiveAccess + (target.cognitiveAccess - defaultState.cognitiveAccess) * t,
    description: t > 0.5 ? target.description : 'Transitioning...'
  };
}

const DEFAULT_BODY_STATE = {
  heartRate: 72,
  muscleTension: 0.4,
  breathingRate: 14,
  cognitiveAccess: 0.6,
  description: 'Transitioning between states...'
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [128, 128, 128];
}

function drawBar(ctx, x, y, w, h, value, color) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * Math.min(1, Math.max(0, value)), h);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let yPos = y;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, yPos);
      line = words[i] + ' ';
      yPos += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, yPos);
}

export function AnnealingSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const basinsRef = useRef(null);
  const landscapeRef = useRef(null);
  const stateRef = useRef(null);
  const animationRef = useRef(null);
  
  const [precision, setPrecision] = useState(0.75);
  const [currentBasin, setCurrentBasin] = useState(null);
  const [bodyState, setBodyState] = useState(DEFAULT_BODY_STATE);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [isQuenched, setIsQuenched] = useState(false);
  
  const temperature = 1 - precision;
  
  useEffect(() => {
    basinsRef.current = initializeBasins(width, height);
    landscapeRef.current = computeLandscape(width, height, basinsRef.current);
    
    const ventral = basinsRef.current[0];
    stateRef.current = {
      x: ventral.x + (Math.random() - 0.5) * 20,
      y: ventral.y + (Math.random() - 0.5) * 20,
      vx: 0,
      vy: 0,
      trail: [],
    };
  }, [width, height]);
  
  const handleQuench = useCallback(() => {
    if (!basinsRef.current || !stateRef.current) return;
    
    const sympathetic = basinsRef.current[1];
    stateRef.current.x = sympathetic.x + (Math.random() - 0.5) * 30;
    stateRef.current.y = sympathetic.y + (Math.random() - 0.5) * 30;
    stateRef.current.vx = 0;
    stateRef.current.vy = 0;
    stateRef.current.trail = [];
    
    setPrecision(0.95);
    setIsQuenched(true);
    setTimeout(() => setIsQuenched(false), 500);
  }, []);
  
  const handleReset = useCallback(() => {
    if (!basinsRef.current) return;
    
    const ventral = basinsRef.current[0];
    stateRef.current = {
      x: ventral.x,
      y: ventral.y,
      vx: 0,
      vy: 0,
      trail: [],
    };
    setPrecision(0.75);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const bodyPanelWidth = isMobile ? 0 : 160;
    const landscapeWidth = width - bodyPanelWidth;
    
    const animate = () => {
      const basins = basinsRef.current;
      const { landscape, basinMap, resolution, cols, rows } = landscapeRef.current || {};
      const state = stateRef.current;
      
      if (!basins || !landscape || !state) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const { fx, fy } = getForceAndEnergy(basins, state.x, state.y);
      
      const noise = temperature * 4;
      state.vx += fx * 0.12 + (Math.random() - 0.5) * noise;
      state.vy += fy * 0.12 + (Math.random() - 0.5) * noise;
      
      const damping = 0.8 + precision * 0.15;
      state.vx *= damping;
      state.vy *= damping;
      
      state.x += state.vx;
      state.y += state.vy;
      
      state.x = Math.max(40, Math.min(landscapeWidth - 40, state.x));
      state.y = Math.max(40, Math.min(height - 40, state.y));
      
      state.trail.push({ x: state.x, y: state.y });
      if (state.trail.length > 150) state.trail.shift();
      
      const inBasin = findCurrentBasin(basins, state.x, state.y);
      setCurrentBasin(inBasin ? inBasin.index : null);
      
      const newBodyState = interpolateBodyState(inBasin, inBasin?.proximity || 0, DEFAULT_BODY_STATE);
      setBodyState(newBodyState);
      
      // === RENDERING ===
      ctx.fillStyle = isQuenched ? '#1a0505' : '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      // Energy landscape
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (col * resolution > landscapeWidth) continue;
          
          const e = landscape[row][col];
          const basinIdx = basinMap[row][col];
          
          if (basinIdx >= 0 && basinIdx < basins.length) {
            const basin = basins[basinIdx];
            const [r, g, b] = hexToRgb(basin.color);
            const alpha = Math.max(0.03, 0.18 * (1 - e));
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          } else {
            const gray = Math.floor(15 + e * 8);
            ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray + 2})`;
          }
          ctx.fillRect(col * resolution, row * resolution, resolution, resolution);
        }
      }
      
      // Basin boundaries
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let row = 1; row < rows; row++) {
        for (let col = 1; col < cols; col++) {
          if (col * resolution > landscapeWidth) continue;
          const current = basinMap[row][col];
          const left = basinMap[row][col - 1];
          const up = basinMap[row - 1][col];
          if ((current !== left || current !== up) && current >= 0) {
            ctx.beginPath();
            ctx.arc(col * resolution, row * resolution, 1, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      
      // Draw basins
      basins.forEach((basin, idx) => {
        if (basin.x > landscapeWidth) return;
        
        const isActive = currentBasin === idx;
        
        for (let r = basin.radius; r > 8; r -= 12) {
          ctx.strokeStyle = basin.color + (isActive ? '35' : '18');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(basin.x, basin.y, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        const gradient = ctx.createRadialGradient(basin.x, basin.y, 0, basin.x, basin.y, 25);
        gradient.addColorStop(0, basin.color + (isActive ? '70' : '35'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(basin.x, basin.y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isActive ? basin.color : 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(basin.label, basin.x, basin.y + basin.radius + 14);
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = isActive ? basin.color + 'cc' : 'rgba(255, 255, 255, 0.3)';
        ctx.fillText(basin.subtitle, basin.x, basin.y + basin.radius + 24);
      });
      
      // Trajectory
      if (showTrajectory && state.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(state.trail[0].x, state.trail[0].y);
        for (let i = 1; i < state.trail.length; i++) {
          const alpha = (i / state.trail.length) * 0.4;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineTo(state.trail[i].x, state.trail[i].y);
        }
        ctx.stroke();
      }
      
      // State ball
      const ballGradient = ctx.createRadialGradient(state.x - 2, state.y - 2, 0, state.x, state.y, 10);
      ballGradient.addColorStop(0, '#ffffff');
      ballGradient.addColorStop(0.5, '#d0d0d0');
      ballGradient.addColorStop(1, '#808080');
      
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(state.x, state.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Thermal noise particles
      if (temperature > 0.3) {
        const particleCount = Math.floor(temperature * 15);
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 12 + Math.random() * 18;
          const px = state.x + Math.cos(angle) * dist;
          const py = state.y + Math.sin(angle) * dist;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.25})`;
          ctx.beginPath();
          ctx.arc(px, py, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // === BODY STATE PANEL ===
      if (!isMobile && bodyPanelWidth > 0) {
        const panelX = landscapeWidth + 10;
        
        ctx.fillStyle = 'rgba(20, 20, 25, 0.95)';
        ctx.fillRect(landscapeWidth, 0, bodyPanelWidth, height);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(landscapeWidth, 0);
        ctx.lineTo(landscapeWidth, height);
        ctx.stroke();
        
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'left';
        ctx.fillText('BODY STATE', panelX, 20);
        
        let yPos = 45;
        const barWidth = 100;
        const barHeight = 6;
        
        // Heart Rate
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('Heart Rate', panelX, yPos);
        yPos += 12;
        const hrNorm = (bodyState.heartRate - 50) / 80;
        drawBar(ctx, panelX, yPos, barWidth, barHeight, hrNorm, '#f87171');
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`${bodyState.heartRate} bpm`, panelX + barWidth + 8, yPos + 5);
        yPos += 28;
        
        // Muscle Tension
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('Muscle Tension', panelX, yPos);
        yPos += 12;
        drawBar(ctx, panelX, yPos, barWidth, barHeight, bodyState.muscleTension, '#fb923c');
        ctx.fillText(`${Math.round(bodyState.muscleTension * 100)}%`, panelX + barWidth + 8, yPos + 5);
        yPos += 28;
        
        // Breathing Rate
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('Breathing', panelX, yPos);
        yPos += 12;
        const brNorm = (bodyState.breathingRate - 6) / 20;
        drawBar(ctx, panelX, yPos, barWidth, barHeight, brNorm, '#60a5fa');
        ctx.fillText(`${bodyState.breathingRate}/min`, panelX + barWidth + 8, yPos + 5);
        yPos += 28;
        
        // Cognitive Access
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('Cognitive Access', panelX, yPos);
        yPos += 12;
        drawBar(ctx, panelX, yPos, barWidth, barHeight, bodyState.cognitiveAccess, '#4ade80');
        ctx.fillText(`${Math.round(bodyState.cognitiveAccess * 100)}%`, panelX + barWidth + 8, yPos + 5);
        yPos += 28;
        
        // Description
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '8px "JetBrains Mono", monospace';
        wrapText(ctx, bodyState.description, panelX, yPos + 10, bodyPanelWidth - 20, 11);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, precision, temperature, showTrajectory, currentBasin, bodyState, isQuenched, isMobile]);
  
  const handleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const bodyPanelWidth = isMobile ? 0 : 160;
    
    if (x > width - bodyPanelWidth) return;
    
    if (stateRef.current) {
      stateRef.current.x = x;
      stateRef.current.y = y;
      stateRef.current.vx = 0;
      stateRef.current.vy = 0;
      stateRef.current.trail = [{ x, y }];
    }
  }, [width, isMobile]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full cursor-crosshair"
        onClick={handleClick}
      />
      
      {/* Info Panel - Collapsible */}
      <CollapsiblePanel title="Configuration Constraint" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          The ball is your whole-body configuration. High precision traps you in 
          current states. <span className="text-red-400">Quench</span> simulates 
          trauma—rapid freezing into defensive configuration.
          <span className="text-orange-400"> Click</span> to relocate.
        </div>
      </CollapsiblePanel>
      
      {/* Precision Control - Collapsible */}
      <CollapsibleControlPanel title="PRECISION (inverse temperature)" position="bottom-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-xs text-muted/60 mb-2">High = rigid, trapped • Low = flexible</div>
        <input
          type="range"
          min="0.1"
          max="0.98"
          step="0.01"
          value={precision}
          onChange={(e) => setPrecision(parseFloat(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-glow"
        />
        <div className="flex justify-between mt-2 text-xs font-mono">
          <span className="text-orange-400">Flexible</span>
          <span className="text-text">{precision.toFixed(2)}</span>
          <span className="text-blue-400">Rigid</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <div className="font-mono text-xs text-muted">CURRENT STATE</div>
          <div className="font-mono text-sm mt-1">
            {currentBasin !== null ? (
              <span style={{ color: basinsRef.current?.[currentBasin]?.color }}>
                {basinsRef.current?.[currentBasin]?.label}
              </span>
            ) : (
              <span className="text-muted">Transitioning...</span>
            )}
          </div>
        </div>
      </CollapsibleControlPanel>
      
      {/* Action Buttons */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'} flex flex-col gap-2 z-10`} style={{ marginRight: isMobile || isFullscreen ? 0 : 170 }}>
        <button
          onClick={handleQuench}
          className="px-3 py-2 bg-red-900/50 border border-red-500 rounded text-xs font-mono text-red-400 hover:bg-red-800/50 transition-colors"
        >
          ⚡ Quench (Trauma)
        </button>
        <button
          onClick={() => setShowTrajectory(!showTrajectory)}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} border rounded font-mono transition-colors ${
            showTrajectory
              ? 'bg-glow/20 border-glow text-glow'
              : 'bg-surface border-border text-muted hover:text-text'
          }`}
        >
          Trajectory
        </button>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          Reset (Safe)
        </button>
      </div>
    </div>
  );
}
