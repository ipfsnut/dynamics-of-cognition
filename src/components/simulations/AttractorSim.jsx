import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * AttractorSim - Memory as attractor dynamics
 * 
 * Shows:
 * - An energy landscape with multiple attractor basins (memories)
 * - A state point that falls into nearby attractors when released
 * - Demonstrates how partial cues lead to full recall
 * - Basin boundaries show where memories "compete"
 * 
 * Key insight: Memory recall is gradient descent to the nearest attractor
 */

const NUM_ATTRACTORS = 5;
const ATTRACTOR_COLORS = [
  '#60a5fa', // blue
  '#f87171', // red
  '#4ade80', // green
  '#facc15', // yellow
  '#a78bfa', // purple
];

function initializeAttractors(width, height) {
  const attractors = [];
  const margin = 60;
  const usableWidth = width - margin * 2;
  const usableHeight = height - margin * 2;
  
  // Place attractors with some spacing
  for (let i = 0; i < NUM_ATTRACTORS; i++) {
    let x, y;
    let attempts = 0;
    
    do {
      x = margin + Math.random() * usableWidth;
      y = margin + Math.random() * usableHeight;
      attempts++;
    } while (
      attempts < 50 &&
      attractors.some(a => {
        const dx = a.x - x;
        const dy = a.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 100;
      })
    );
    
    attractors.push({
      x, y,
      strength: 0.5 + Math.random() * 0.5,
      label: `Memory ${i + 1}`,
      color: ATTRACTOR_COLORS[i],
    });
  }
  
  return attractors;
}

function computeEnergyLandscape(width, height, attractors, resolution = 4) {
  const cols = Math.ceil(width / resolution);
  const rows = Math.ceil(height / resolution);
  const landscape = [];
  const basins = []; // Which attractor each point belongs to
  
  for (let row = 0; row < rows; row++) {
    landscape[row] = [];
    basins[row] = [];
    
    for (let col = 0; col < cols; col++) {
      const x = col * resolution;
      const y = row * resolution;
      
      let minEnergy = Infinity;
      let closestAttractor = -1;
      
      attractors.forEach((attractor, idx) => {
        const dx = x - attractor.x;
        const dy = y - attractor.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const energy = dist / (attractor.strength * 100);
        
        if (energy < minEnergy) {
          minEnergy = energy;
          closestAttractor = idx;
        }
      });
      
      landscape[row][col] = Math.min(1, minEnergy / 5);
      basins[row][col] = closestAttractor;
    }
  }
  
  return { landscape, basins, resolution, cols, rows };
}

function getGradient(attractors, x, y) {
  let fx = 0, fy = 0;
  let totalEnergy = 0;
  
  attractors.forEach(attractor => {
    const dx = attractor.x - x;
    const dy = attractor.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    
    // Attraction force (inverse square, capped)
    const force = attractor.strength * 50 / (dist + 10);
    fx += (dx / dist) * force;
    fy += (dy / dist) * force;
    
    totalEnergy += dist / attractor.strength;
  });
  
  return { fx, fy, energy: totalEnergy };
}

function findNearestAttractor(attractors, x, y) {
  let minDist = Infinity;
  let nearest = null;
  
  attractors.forEach((a, idx) => {
    const dx = a.x - x;
    const dy = a.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
      minDist = dist;
      nearest = { attractor: a, index: idx, distance: dist };
    }
  });
  
  return nearest;
}

export function AttractorSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const attractorsRef = useRef(null);
  const landscapeRef = useRef(null);
  const particleRef = useRef(null);
  const animationRef = useRef(null);
  const [isRecalling, setIsRecalling] = useState(false);
  const [showBasins, setShowBasins] = useState(true);
  const [recalledMemory, setRecalledMemory] = useState(null);
  
  // Initialize
  useEffect(() => {
    attractorsRef.current = initializeAttractors(width, height);
    landscapeRef.current = computeEnergyLandscape(width, height, attractorsRef.current);
    particleRef.current = null;
  }, [width, height]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const damping = 0.92;
    
    const animate = () => {
      const attractors = attractorsRef.current;
      const { landscape, basins, resolution, cols, rows } = landscapeRef.current || {};
      const particle = particleRef.current;
      
      if (!attractors || !landscape) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Update particle if recalling
      if (particle && isRecalling) {
        const grad = getGradient(attractors, particle.x, particle.y);
        
        particle.vx += grad.fx * 0.01;
        particle.vy += grad.fy * 0.01;
        particle.vx *= damping;
        particle.vy *= damping;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 150) particle.trail.shift();
        
        // Check if settled into an attractor
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const nearest = findNearestAttractor(attractors, particle.x, particle.y);
        
        if (speed < 0.5 && nearest.distance < 20) {
          setRecalledMemory(nearest.index);
          setIsRecalling(false);
        }
      }
      
      // Draw
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      // Draw basin regions if enabled
      if (showBasins && basins) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const attractorIdx = basins[row][col];
            const energy = landscape[row][col];
            
            if (attractorIdx >= 0) {
              const color = ATTRACTOR_COLORS[attractorIdx];
              // Parse hex color and apply alpha
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              const alpha = 0.1 * (1 - energy * 0.5);
              
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.fillRect(col * resolution, row * resolution, resolution, resolution);
            }
          }
        }
      }
      
      // Draw basin boundaries
      if (showBasins && basins) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let row = 1; row < rows; row++) {
          for (let col = 1; col < cols; col++) {
            const current = basins[row][col];
            const left = basins[row][col - 1];
            const up = basins[row - 1][col];
            
            if (current !== left || current !== up) {
              ctx.beginPath();
              ctx.arc(col * resolution, row * resolution, 1, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }
      
      // Draw attractors
      attractors.forEach((attractor, idx) => {
        const isActive = recalledMemory === idx;
        
        // Glow
        const gradient = ctx.createRadialGradient(
          attractor.x, attractor.y, 0,
          attractor.x, attractor.y, 40
        );
        gradient.addColorStop(0, attractor.color + (isActive ? '80' : '40'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(attractor.x, attractor.y, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.fillStyle = isActive ? attractor.color : attractor.color + '80';
        ctx.beginPath();
        ctx.arc(attractor.x, attractor.y, isActive ? 12 : 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isActive ? attractor.color : 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(attractor.label, attractor.x, attractor.y + 25);
      });
      
      // Draw particle and trail
      if (particle) {
        // Trail
        if (particle.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Particle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('cue', particle.x, particle.y - 15);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, isRecalling, showBasins, recalledMemory]);
  
  // Click to place cue and start recall
  const handleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    particleRef.current = {
      x, y,
      vx: 0, vy: 0,
      trail: [{ x, y }],
    };
    
    setRecalledMemory(null);
    setIsRecalling(true);
  }, []);
  
  // Reset
  const handleReset = useCallback(() => {
    attractorsRef.current = initializeAttractors(width, height);
    landscapeRef.current = computeEnergyLandscape(width, height, attractorsRef.current);
    particleRef.current = null;
    setIsRecalling(false);
    setRecalledMemory(null);
  }, [width, height]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full cursor-crosshair"
        onClick={handleClick}
      />
      
      {/* Status - Collapsible */}
      <CollapsiblePanel title="RECALL STATUS" position="bottom-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="font-mono text-lg">
          {recalledMemory !== null ? (
            <span style={{ color: ATTRACTOR_COLORS[recalledMemory] }}>
              {attractorsRef.current?.[recalledMemory]?.label || 'Memory'} recalled
            </span>
          ) : isRecalling ? (
            <span className="text-white animate-pulse">Recalling...</span>
          ) : (
            <span className="text-muted">Click to place cue</span>
          )}
        </div>
      </CollapsiblePanel>
      
      {/* Controls */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'} flex gap-2`}>
        <button
          onClick={() => setShowBasins(!showBasins)}
          className={`px-3 py-1 border rounded text-xs font-mono transition-colors ${
            showBasins
              ? 'bg-glow/20 border-glow text-glow'
              : 'bg-surface border-border text-muted hover:text-text'
          }`}
        >
          Basins
        </button>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          Reset
        </button>
      </div>
      
      {/* Info - Collapsible */}
      <CollapsiblePanel title="Memory as Attractors" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          Click anywhere to place a recall cue. The system will fall into 
          the nearest memory attractor—partial cues lead to full recall.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
