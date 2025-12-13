import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * InteroceptivePathwaySim - The Flow of Bodily Feeling
 * 
 * Based on Craig's work: interoceptive signals flow from body through
 * progressively integrated representations, culminating in a "global
 * emotional moment" - how you feel RIGHT NOW.
 * 
 * Abstract visualization (not literal anatomy):
 * - Body layer: raw signals arise (temperature, visceral, pain, etc.)
 * - Integration layers: signals converge and combine
 * - "Now" layer: unified feeling state emerges
 * - Bidirectional: efferent regulation flows back down
 * 
 * Key insight: the pathway doesn't just transmit - it TRANSFORMS.
 * Raw signals become felt experience through integration.
 */

const SIGNAL_TYPES = [
  { id: 'thermal', label: 'Temperature', color: '#f87171', baseRate: 0.8 },
  { id: 'visceral', label: 'Visceral', color: '#a78bfa', baseRate: 1.0 },
  { id: 'cardiac', label: 'Cardiac', color: '#f472b6', baseRate: 1.2 },
  { id: 'respiratory', label: 'Respiratory', color: '#60a5fa', baseRate: 0.9 },
  { id: 'nociceptive', label: 'Pain', color: '#fbbf24', baseRate: 0.4 },
];

const LAYERS = [
  { id: 'body', label: 'Body', y: 0.85, description: 'Raw interoceptive signals' },
  { id: 'primary', label: 'Primary', y: 0.6, description: 'Initial cortical representation' },
  { id: 'integration', label: 'Integration', y: 0.38, description: 'Cross-modal binding' },
  { id: 'now', label: 'Now', y: 0.15, description: 'Global emotional moment' },
];

function createParticle(type, x, width) {
  const signal = SIGNAL_TYPES.find(s => s.id === type) || SIGNAL_TYPES[0];
  return {
    type,
    x: x + (Math.random() - 0.5) * width * 0.15,
    y: LAYERS[0].y,
    layer: 0,
    progress: 0,
    speed: 0.3 + Math.random() * 0.2,
    color: signal.color,
    size: 3 + Math.random() * 2,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 1 + Math.random(),
    opacity: 0.7 + Math.random() * 0.3,
    merged: false,
  };
}

function createEfferent(x, startY) {
  return {
    x,
    y: startY,
    targetY: LAYERS[0].y + 0.05,
    speed: 0.15 + Math.random() * 0.1,
    opacity: 0.6,
    size: 2,
  };
}

export function InteroceptivePathwaySim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const efferentsRef = useRef([]);
  const timeRef = useRef(0);
  
  const [signalIntensity, setSignalIntensity] = useState(() => {
    const initial = {};
    SIGNAL_TYPES.forEach(s => { initial[s.id] = 0.5; });
    return initial;
  });
  const [globalFeeling, setGlobalFeeling] = useState({ valence: 0, arousal: 0.5 });
  const [showEfferents, setShowEfferents] = useState(true);
  
  // Spawn particles based on signal intensity
  const spawnParticles = useCallback((width) => {
    const particles = particlesRef.current;
    
    SIGNAL_TYPES.forEach((signal, idx) => {
      const intensity = signalIntensity[signal.id];
      const spawnRate = signal.baseRate * intensity * 0.15;
      
      if (Math.random() < spawnRate) {
        // Spread signals across the body layer
        const spreadX = width * (0.15 + (idx / SIGNAL_TYPES.length) * 0.7);
        particles.push(createParticle(signal.id, spreadX, width));
      }
    });
    
    // Limit particles
    if (particles.length > 200) {
      particlesRef.current = particles.slice(-150);
    }
  }, [signalIntensity]);
  
  // Spawn efferent signals (regulation flowing back down)
  const spawnEfferents = useCallback((width) => {
    if (!showEfferents) return;
    
    const efferents = efferentsRef.current;
    if (Math.random() < 0.05) {
      const x = width * (0.3 + Math.random() * 0.4);
      efferents.push(createEfferent(x, LAYERS[3].y + 0.05));
    }
    
    if (efferents.length > 30) {
      efferentsRef.current = efferents.slice(-20);
    }
  }, [showEfferents]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      
      // Clear
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      const marginX = width * 0.08;
      const usableWidth = width - marginX * 2;
      const marginY = height * 0.08;
      const usableHeight = height - marginY * 2;
      
      // Draw layer zones
      LAYERS.forEach((layer, idx) => {
        const y = marginY + layer.y * usableHeight;
        const nextY = idx < LAYERS.length - 1 
          ? marginY + LAYERS[idx + 1].y * usableHeight 
          : marginY;
        const zoneHeight = y - nextY;
        
        // Layer background
        const gradient = ctx.createLinearGradient(0, nextY, 0, y);
        const alpha = layer.id === 'now' ? 0.15 : 0.05;
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.3})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(marginX, nextY, usableWidth, zoneHeight);
        
        // Layer label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.textAlign = 'left';
        ctx.fillText(layer.label.toUpperCase(), marginX + 8, y - 8);
        
        // Horizontal guide line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(marginX, y);
        ctx.lineTo(marginX + usableWidth, y);
        ctx.stroke();
      });
      
      // Spawn new particles
      spawnParticles(width);
      spawnEfferents(width);
      
      // Update and draw efferents (behind particles)
      if (showEfferents) {
        efferentsRef.current = efferentsRef.current.filter(e => {
          e.y += e.speed * 0.016 * 2;
          e.opacity -= 0.003;
          
          if (e.y > e.targetY || e.opacity <= 0) return false;
          
          const screenY = marginY + e.y * usableHeight;
          ctx.beginPath();
          ctx.arc(e.x, screenY, e.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74, 222, 128, ${e.opacity * 0.5})`;
          ctx.fill();
          
          return true;
        });
      }
      
      // Track signals reaching the top for feeling computation
      let topSignals = { thermal: 0, visceral: 0, cardiac: 0, respiratory: 0, nociceptive: 0 };
      let totalTop = 0;
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        // Move upward
        p.progress += p.speed * 0.016;
        
        // Determine current layer based on progress
        const targetLayer = Math.min(3, Math.floor(p.progress * 4));
        if (targetLayer > p.layer) {
          p.layer = targetLayer;
          // Particles converge as they rise
          const centerX = width / 2;
          p.x = p.x + (centerX - p.x) * 0.3;
          // Merge effect at higher layers
          if (p.layer >= 2) {
            p.merged = true;
            p.size *= 0.8;
          }
        }
        
        // Calculate Y position (interpolate between layers)
        const fromLayer = LAYERS[Math.max(0, p.layer)];
        const toLayer = LAYERS[Math.min(3, p.layer + 1)];
        const layerProgress = (p.progress * 4) % 1;
        const targetY = fromLayer.y - (fromLayer.y - toLayer.y) * layerProgress;
        p.y = targetY;
        
        // Wobble
        p.wobble += p.wobbleSpeed * 0.016;
        const wobbleX = Math.sin(p.wobble) * (8 - p.layer * 2);
        
        // Screen position
        const screenX = p.x + wobbleX;
        const screenY = marginY + p.y * usableHeight;
        
        // Remove if past top
        if (p.y < LAYERS[3].y - 0.1) {
          topSignals[p.type]++;
          totalTop++;
          return false;
        }
        
        // Draw particle
        const alpha = p.opacity * (p.merged ? 0.6 : 1);
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Trail
        if (!p.merged) {
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX - wobbleX * 0.5, screenY + 15);
          ctx.strokeStyle = p.color + '20';
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
        }
        
        return true;
      });
      
      // Compute global feeling from integrated signals
      if (totalTop > 0) {
        const painRatio = topSignals.nociceptive / totalTop;
        const cardiacRatio = topSignals.cardiac / totalTop;
        const visceralRatio = topSignals.visceral / totalTop;
        
        // Valence: negative if pain-heavy, neutral to positive otherwise
        const newValence = globalFeeling.valence * 0.95 + 
          (0.5 - painRatio * 2 + (1 - visceralRatio) * 0.3) * 0.05;
        
        // Arousal: higher with more cardiac and overall signal density
        const density = Math.min(1, totalTop / 10);
        const newArousal = globalFeeling.arousal * 0.95 + 
          (cardiacRatio * 0.5 + density * 0.5) * 0.05;
        
        setGlobalFeeling({ 
          valence: Math.max(-1, Math.min(1, newValence)), 
          arousal: Math.max(0, Math.min(1, newArousal)) 
        });
      }
      
      // Draw "Now" indicator
      const nowY = marginY + LAYERS[3].y * usableHeight;
      const nowX = width / 2;
      const nowRadius = 25 + globalFeeling.arousal * 15;
      
      // Feeling color based on valence
      const r = Math.round(globalFeeling.valence < 0 ? 200 + globalFeeling.valence * -50 : 100);
      const g = Math.round(globalFeeling.valence > 0 ? 180 + globalFeeling.valence * 40 : 120);
      const b = 150;
      const feelingColor = `rgb(${r}, ${g}, ${b})`;
      
      // Glow
      const glowGradient = ctx.createRadialGradient(nowX, nowY, 0, nowX, nowY, nowRadius * 2);
      glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`);
      glowGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.08)`);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(nowX, nowY, nowRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Core
      ctx.beginPath();
      ctx.arc(nowX, nowY, nowRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.38)`;
      ctx.fill();
      ctx.strokeStyle = feelingColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Pulse
      const pulse = Math.sin(t * 3) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(nowX, nowY, nowRadius + pulse * 10, 0, Math.PI * 2);
      ctx.strokeStyle = feelingColor + '30';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // "Now" label
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff90';
      ctx.textAlign = 'center';
      ctx.fillText('NOW', nowX, nowY + 4);
      
      // Body region indicators
      const bodyY = marginY + LAYERS[0].y * usableHeight;
      SIGNAL_TYPES.forEach((signal, idx) => {
        const x = marginX + usableWidth * (0.1 + (idx / (SIGNAL_TYPES.length - 1)) * 0.8);
        const intensity = signalIntensity[signal.id];
        
        // Source indicator
        ctx.beginPath();
        ctx.arc(x, bodyY + 15, 4 + intensity * 4, 0, Math.PI * 2);
        ctx.fillStyle = signal.color + Math.floor(intensity * 200 + 55).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Label
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(signal.label, x, bodyY + 35);
      });
      
      // Description
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.textAlign = 'center';
      ctx.fillText('Signals converge → integrate → unified feeling', width / 2, height - 15);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, spawnParticles, spawnEfferents, showEfferents, globalFeeling, signalIntensity]);
  
  const handleIntensityChange = useCallback((type, value) => {
    setSignalIntensity(prev => ({ ...prev, [type]: value }));
  }, []);
  
  const applyPreset = useCallback((preset) => {
    switch (preset) {
      case 'calm':
        setSignalIntensity({ thermal: 0.3, visceral: 0.2, cardiac: 0.3, respiratory: 0.3, nociceptive: 0.05 });
        break;
      case 'anxious':
        setSignalIntensity({ thermal: 0.4, visceral: 0.7, cardiac: 0.9, respiratory: 0.8, nociceptive: 0.2 });
        break;
      case 'pain':
        setSignalIntensity({ thermal: 0.5, visceral: 0.4, cardiac: 0.6, respiratory: 0.5, nociceptive: 0.9 });
        break;
      case 'exertion':
        setSignalIntensity({ thermal: 0.8, visceral: 0.3, cardiac: 0.95, respiratory: 0.9, nociceptive: 0.3 });
        break;
    }
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Feeling State - Collapsible */}
      <CollapsiblePanel title="GLOBAL FEELING" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex gap-4 text-xs font-mono">
          <div>
            <span className="text-muted">Valence:</span>{' '}
            <span className={globalFeeling.valence > 0 ? 'text-green-400' : globalFeeling.valence < -0.2 ? 'text-red-400' : 'text-yellow-400'}>
              {globalFeeling.valence > 0.2 ? 'Pleasant' : globalFeeling.valence < -0.2 ? 'Unpleasant' : 'Neutral'}
            </span>
          </div>
          <div>
            <span className="text-muted">Arousal:</span>{' '}
            <span className="text-blue-400">
              {globalFeeling.arousal > 0.6 ? 'High' : globalFeeling.arousal < 0.3 ? 'Low' : 'Medium'}
            </span>
          </div>
        </div>
      </CollapsiblePanel>
      
      {/* Controls - Collapsible */}
      <CollapsibleControlPanel title="SIGNAL INTENSITY" position="bottom-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="space-y-2">
          {SIGNAL_TYPES.map(signal => (
            <div key={signal.id} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: signal.color }}
              />
              <span className="font-mono text-xs text-muted w-16">{signal.label.slice(0, 6)}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={signalIntensity[signal.id]}
                onChange={(e) => handleIntensityChange(signal.id, parseFloat(e.target.value))}
                className="flex-1 h-1 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-2 border-t border-border">
          <div className="font-mono text-xs text-muted mb-2">PRESETS</div>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'calm', label: 'Calm' },
              { id: 'anxious', label: 'Anxious' },
              { id: 'pain', label: 'Pain' },
              { id: 'exertion', label: 'Exertion' },
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono text-muted hover:text-text hover:border-glow transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-border">
          <button
            onClick={() => setShowEfferents(!showEfferents)}
            className={`px-2 py-1 border rounded text-xs font-mono transition-colors ${
              showEfferents
                ? 'bg-green-500/20 border-green-500 text-green-400'
                : 'bg-surface border-border text-muted'
            }`}
          >
            Efferents: {showEfferents ? 'ON' : 'OFF'}
          </button>
        </div>
      </CollapsibleControlPanel>
      
      {/* Info - Collapsible */}
      <CollapsiblePanel title="Interoceptive Pathway" position="top-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          Raw body signals converge through integration layers into a unified 
          "now"—how you feel this moment. Green dots are efferent regulation 
          signals flowing back to the body.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
