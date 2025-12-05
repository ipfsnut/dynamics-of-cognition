import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * HomeostaticSim - Damasio's Homeostatic Feelings Visualization
 * 
 * Core thesis: Feelings ARE the phenomenology of homeostatic prediction errors.
 * ε = μ* − μ  (optimal state minus current state)
 * 
 * When ε ≈ 0: pleasant feelings (homeostasis maintained)
 * When ε large: unpleasant feelings (homeostasis threatened)
 * 
 * Shows:
 * - Multiple homeostatic variables (temperature, glucose, hydration, etc.)
 * - Each has an optimal setpoint (μ*) and current value (μ)
 * - The "feeling" emerges from the aggregate prediction error
 * - Demonstrates the body-brain partnership Damasio emphasizes
 */

const VARIABLES = [
  { 
    id: 'temperature', 
    label: 'Core Temp', 
    optimal: 37.0, 
    min: 35.0, 
    max: 40.0,
    unit: '°C',
    color: '#f87171',
    sensitivity: 2.0,
  },
  { 
    id: 'glucose', 
    label: 'Blood Glucose', 
    optimal: 90, 
    min: 50, 
    max: 150,
    unit: 'mg/dL',
    color: '#facc15',
    sensitivity: 1.0,
  },
  { 
    id: 'hydration', 
    label: 'Hydration', 
    optimal: 0.6, 
    min: 0.3, 
    max: 0.8,
    unit: '%',
    color: '#60a5fa',
    sensitivity: 1.5,
  },
  { 
    id: 'oxygen', 
    label: 'O₂ Saturation', 
    optimal: 98, 
    min: 85, 
    max: 100,
    unit: '%',
    color: '#4ade80',
    sensitivity: 3.0,
  },
  { 
    id: 'cortisol', 
    label: 'Cortisol', 
    optimal: 15, 
    min: 5, 
    max: 40,
    unit: 'μg/dL',
    color: '#a78bfa',
    sensitivity: 0.8,
  },
];

function initializeState() {
  const state = {};
  VARIABLES.forEach(v => {
    const range = v.max - v.min;
    state[v.id] = v.optimal + (Math.random() - 0.5) * range * 0.2;
  });
  return state;
}

function computeFeelingState(state) {
  let totalError = 0;
  const errors = {};
  
  VARIABLES.forEach(v => {
    const current = state[v.id];
    const optimal = v.optimal;
    const range = v.max - v.min;
    const error = Math.abs(current - optimal) / range;
    errors[v.id] = error;
    totalError += error * v.sensitivity;
  });
  
  const feeling = Math.min(1, totalError / (VARIABLES.length * 0.5));
  return { feeling, errors };
}

function getFeelingDescription(feeling) {
  if (feeling < 0.1) return { text: 'Serene wellbeing', color: '#4ade80' };
  if (feeling < 0.2) return { text: 'Content', color: '#86efac' };
  if (feeling < 0.35) return { text: 'Neutral', color: '#fde047' };
  if (feeling < 0.5) return { text: 'Slight unease', color: '#fbbf24' };
  if (feeling < 0.7) return { text: 'Discomfort', color: '#f97316' };
  if (feeling < 0.85) return { text: 'Distress', color: '#ef4444' };
  return { text: 'Crisis', color: '#dc2626' };
}

export function HomeostaticSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animationRef = useRef(null);
  
  const [feeling, setFeeling] = useState(0);
  const [feelingDesc, setFeelingDesc] = useState({ text: 'Content', color: '#4ade80' });
  const [autoRegulate, setAutoRegulate] = useState(false);
  const [selectedVar, setSelectedVar] = useState(null);
  
  useEffect(() => {
    stateRef.current = initializeState();
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    const animate = () => {
      time += 0.016;
      const state = stateRef.current;
      if (!state) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      VARIABLES.forEach(v => {
        const range = v.max - v.min;
        state[v.id] += (Math.random() - 0.5) * range * 0.003;
        
        if (autoRegulate) {
          const error = v.optimal - state[v.id];
          state[v.id] += error * 0.02;
        }
        
        state[v.id] = Math.max(v.min, Math.min(v.max, state[v.id]));
      });
      
      const { feeling: f, errors } = computeFeelingState(state);
      setFeeling(f);
      setFeelingDesc(getFeelingDescription(f));
      
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2 - 30;
      const maxRadius = Math.min(width, height) * 0.32;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Feeling aura
      const desc = getFeelingDescription(f);
      const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius + 50);
      auraGradient.addColorStop(0, desc.color + '30');
      auraGradient.addColorStop(0.5, desc.color + '10');
      auraGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius + 50, 0, Math.PI * 2);
      ctx.fill();
      
      // Body outline
      const pulsePhase = Math.sin(time * 2 + f * 5) * 0.1 * f;
      const bodyRadius = maxRadius * (0.6 + pulsePhase);
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + (1 - f) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyRadius * 0.8, bodyRadius, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw variables as gauges
      const numVars = VARIABLES.length;
      VARIABLES.forEach((v, i) => {
        const angle = -Math.PI / 2 + (i / numVars) * Math.PI * 2;
        const gaugeRadius = maxRadius * 1.1;
        const gx = Math.cos(angle) * gaugeRadius;
        const gy = Math.sin(angle) * gaugeRadius;
        
        const value = state[v.id];
        const normalized = (value - v.min) / (v.max - v.min);
        const optNormalized = (v.optimal - v.min) / (v.max - v.min);
        const error = errors[v.id];
        
        const gaugeWidth = 60;
        const gaugeHeight = 8;
        
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(angle + Math.PI / 2);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(-gaugeWidth / 2, -gaugeHeight / 2, gaugeWidth, gaugeHeight);
        
        const optWidth = 10;
        ctx.fillStyle = 'rgba(74, 222, 128, 0.3)';
        ctx.fillRect(-gaugeWidth / 2 + optNormalized * gaugeWidth - optWidth / 2, -gaugeHeight / 2, optWidth, gaugeHeight);
        
        const valueX = -gaugeWidth / 2 + normalized * gaugeWidth;
        ctx.fillStyle = error > 0.3 ? '#f87171' : v.color;
        ctx.beginPath();
        ctx.arc(valueX, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        const labelDist = maxRadius * 1.35;
        const lx = Math.cos(angle) * labelDist;
        const ly = Math.sin(angle) * labelDist;
        
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = selectedVar === v.id ? v.color : 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(v.label, lx, ly);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText(`${value.toFixed(1)}${v.unit}`, lx, ly + 12);
        
        ctx.strokeStyle = v.color + (error > 0.2 ? '60' : '20');
        ctx.lineWidth = 1 + error * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(gx * 0.7, gy * 0.7);
        ctx.stroke();
        
        if (error > 0.25) {
          const pulseRadius = 10 + Math.sin(time * 5) * 5;
          ctx.strokeStyle = v.color + '40';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(gx * 0.7, gy * 0.7, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      
      // Central feeling indicator
      ctx.fillStyle = desc.color;
      ctx.beginPath();
      ctx.arc(0, 0, 20 + f * 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0a0a0c';
      ctx.fillText('ε', 0, 4);
      
      ctx.restore();
      
      // Equation
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.textAlign = 'center';
      ctx.fillText('ε = μ* − μ', centerX, height - 60);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('prediction error = optimal - current', centerX, height - 45);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, autoRegulate, selectedVar]);
  
  const applyPerturbation = useCallback((type) => {
    const state = stateRef.current;
    if (!state) return;
    
    switch (type) {
      case 'fever':
        state.temperature += 2.0;
        break;
      case 'hunger':
        state.glucose -= 25;
        break;
      case 'dehydration':
        state.hydration -= 0.15;
        break;
      case 'stress':
        state.cortisol += 15;
        break;
      case 'hypoxia':
        state.oxygen -= 8;
        break;
    }
  }, []);
  
  const handleReset = useCallback(() => {
    stateRef.current = initializeState();
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Feeling Status - Collapsible */}
      <CollapsiblePanel title="HOMEOSTATIC FEELING" position="bottom-left" defaultOpen={!isMobile} width="w-56" isFullscreen={isFullscreen}>
        <div 
          className="font-mono text-xl font-medium"
          style={{ color: feelingDesc.color }}
        >
          {feelingDesc.text}
        </div>
        <div className="mt-2 w-full h-2 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${feeling * 100}%`,
              backgroundColor: feelingDesc.color,
            }}
          />
        </div>
        <div className="flex justify-between text-xs font-mono mt-1 text-muted">
          <span>Pleasant</span>
          <span>Unpleasant</span>
        </div>
      </CollapsiblePanel>
      
      {/* Perturbation Controls - Collapsible */}
      <CollapsibleControlPanel title="PERTURBATIONS" position="top-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex flex-col gap-1">
          {[
            { type: 'fever', label: '🌡️ Fever' },
            { type: 'hunger', label: '🍽️ Hunger' },
            { type: 'dehydration', label: '💧 Dehydrate' },
            { type: 'stress', label: '😰 Stress' },
            { type: 'hypoxia', label: '💨 Low O₂' },
          ].map(p => (
            <button
              key={p.type}
              onClick={() => applyPerturbation(p.type)}
              className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text hover:border-glow transition-colors text-left`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-border flex flex-col gap-1">
          <button
            onClick={() => setAutoRegulate(!autoRegulate)}
            className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} border rounded font-mono transition-colors ${
              autoRegulate
                ? 'bg-glow/20 border-glow text-glow'
                : 'bg-red-500/20 border-red-500 text-red-400'
            }`}
          >
            {autoRegulate ? 'Regulation: ON' : 'Regulation: OFF'}
          </button>
          <button
            onClick={handleReset}
            className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
          >
            Reset
          </button>
        </div>
      </CollapsibleControlPanel>
      
      {/* Info - Collapsible */}
      <CollapsiblePanel title="Homeostatic Feelings" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          Feelings emerge from bodily prediction errors. Each gauge shows a 
          homeostatic variable. The central glow reflects aggregate deviation 
          from optimal states—<em>consciousness begins with feeling</em>.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
