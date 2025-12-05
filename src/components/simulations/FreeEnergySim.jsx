import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * FreeEnergySim - Visualization of free energy minimization
 * 
 * Shows a 2D landscape where:
 * - The surface represents variational free energy F
 * - F = D_KL[q||p] + (-ln p(s)) = divergence + surprisal
 * - A particle (the system) rolls downhill, minimizing F
 * - We can visualize both components separately
 * 
 * The key insight: minimizing F simultaneously:
 * 1. Makes q(ψ) approximate p(ψ|s) (perception/inference)
 * 2. Drives system toward expected states (action)
 */

// Generate a free energy landscape
function generateLandscape(width, height, resolution = 4) {
  const cols = Math.ceil(width / resolution);
  const rows = Math.ceil(height / resolution);
  const landscape = [];
  
  // Create multiple basins (attractors in state space)
  const basins = [
    { x: width * 0.3, y: height * 0.4, depth: 1.0, spread: 80 },
    { x: width * 0.7, y: height * 0.6, depth: 0.8, spread: 100 },
    { x: width * 0.5, y: height * 0.3, depth: 0.6, spread: 60 },
  ];
  
  for (let row = 0; row < rows; row++) {
    landscape[row] = [];
    for (let col = 0; col < cols; col++) {
      const x = col * resolution;
      const y = row * resolution;
      
      // Base energy (high = surprising states)
      let energy = 1.0;
      
      // Subtract basin contributions (low energy = expected states)
      for (const basin of basins) {
        const dx = x - basin.x;
        const dy = y - basin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const contribution = basin.depth * Math.exp(-(dist * dist) / (2 * basin.spread * basin.spread));
        energy -= contribution;
      }
      
      // Add some noise for texture
      energy += (Math.random() - 0.5) * 0.05;
      
      landscape[row][col] = Math.max(0, Math.min(1, energy));
    }
  }
  
  return { landscape, basins, resolution, cols, rows };
}

// Calculate gradient at a point (for particle dynamics)
function getGradient(landscape, x, y, resolution) {
  const col = Math.floor(x / resolution);
  const row = Math.floor(y / resolution);
  
  const rows = landscape.length;
  const cols = landscape[0]?.length || 0;
  
  if (row < 1 || row >= rows - 1 || col < 1 || col >= cols - 1) {
    return { dx: 0, dy: 0, value: 0.5 };
  }
  
  // Central differences
  const dx = (landscape[row][col + 1] - landscape[row][col - 1]) / 2;
  const dy = (landscape[row + 1][col] - landscape[row - 1][col]) / 2;
  const value = landscape[row][col];
  
  return { dx, dy, value };
}

// Particle representing the system state
function createParticle(x, y) {
  return {
    x, y,
    vx: 0, vy: 0,
    trail: [],
    energy: 0,
  };
}

export function FreeEnergySim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const landscapeRef = useRef(null);
  const particleRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);
  const [particleEnergy, setParticleEnergy] = useState(0);
  
  // Initialize landscape and particle
  useEffect(() => {
    landscapeRef.current = generateLandscape(width, height);
    particleRef.current = createParticle(width * 0.2, height * 0.8);
  }, [width, height]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const damping = 0.95;
    const gravity = 0.15;
    const maxTrail = 100;
    
    const animate = () => {
      const data = landscapeRef.current;
      const particle = particleRef.current;
      
      if (!data || !particle) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const { landscape, resolution, cols, rows, basins } = data;
      
      // Update particle physics
      if (isRunning) {
        const grad = getGradient(landscape, particle.x, particle.y, resolution);
        
        // Apply force (negative gradient = downhill)
        particle.vx -= grad.dx * gravity;
        particle.vy -= grad.dy * gravity;
        
        // Damping
        particle.vx *= damping;
        particle.vy *= damping;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary constraints
        particle.x = Math.max(10, Math.min(width - 10, particle.x));
        particle.y = Math.max(10, Math.min(height - 10, particle.y));
        
        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > maxTrail) {
          particle.trail.shift();
        }
        
        particle.energy = grad.value;
        setParticleEnergy(grad.value);
      }
      
      // Draw
      // Clear
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      // Draw landscape as contour-like visualization
      const imageData = ctx.createImageData(width, height);
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const energy = landscape[row][col];
          
          // Map energy to color with better contrast
          // Low energy = bright teal, high energy = darker but still visible
          const normalizedEnergy = Math.max(0, Math.min(1, energy));
          const intensity = 1 - normalizedEnergy;
          
          // Enhanced contrast mapping
          const r = Math.floor(intensity * 60 + 30);
          const g = Math.floor(intensity * 150 + 80);
          const b = Math.floor(intensity * 130 + 70);
          
          // Fill resolution x resolution block
          for (let py = 0; py < resolution && row * resolution + py < height; py++) {
            for (let px = 0; px < resolution && col * resolution + px < width; px++) {
              const idx = ((row * resolution + py) * width + (col * resolution + px)) * 4;
              imageData.data[idx] = r;
              imageData.data[idx + 1] = g;
              imageData.data[idx + 2] = b;
              imageData.data[idx + 3] = 255;
            }
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Draw contour lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      const contourLevels = [0.2, 0.4, 0.6, 0.8];
      
      for (const level of contourLevels) {
        ctx.beginPath();
        for (let row = 0; row < rows - 1; row++) {
          for (let col = 0; col < cols - 1; col++) {
            const v = landscape[row][col];
            if (Math.abs(v - level) < 0.05) {
              ctx.rect(col * resolution, row * resolution, 1, 1);
            }
          }
        }
        ctx.stroke();
      }
      
      // Draw basin markers
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      for (let i = 0; i < basins.length; i++) {
        const basin = basins[i];
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(basin.x, basin.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(`attractor ${i + 1}`, basin.x, basin.y + 15);
      }
      
      // Draw particle trail
      if (particle.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
        for (let i = 1; i < particle.trail.length; i++) {
          const alpha = i / particle.trail.length;
          ctx.strokeStyle = `rgba(250, 204, 21, ${alpha * 0.8})`;
          ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
        }
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw particle
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, 15
      );
      gradient.addColorStop(0, 'rgba(250, 204, 21, 0.8)');
      gradient.addColorStop(0.5, 'rgba(250, 204, 21, 0.3)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, isRunning]);
  
  // Click to place particle
  const handleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    particleRef.current = createParticle(x, y);
  }, []);
  
  // Reset
  const handleReset = useCallback(() => {
    landscapeRef.current = generateLandscape(width, height);
    particleRef.current = createParticle(width * 0.2, height * 0.8);
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
      
      {/* Energy display - Collapsible */}
      <CollapsiblePanel title="FREE ENERGY F" position="bottom-left" defaultOpen={!isMobile} width="w-44" isFullscreen={isFullscreen}>
        <div className="flex items-end gap-2">
          <span className="font-mono text-2xl text-glow">
            {particleEnergy.toFixed(3)}
          </span>
          <span className="text-xs text-muted pb-1">
            {particleEnergy < 0.3 ? '(near attractor)' : particleEnergy > 0.7 ? '(high surprise)' : '(descending)'}
          </span>
        </div>
        <div className="mt-2 h-2 w-full bg-surface rounded overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-glow to-accent transition-all"
            style={{ width: `${(1 - particleEnergy) * 100}%` }}
          />
        </div>
      </CollapsiblePanel>
      
      {/* Controls */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'} flex gap-2`}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} border rounded font-mono transition-colors ${
            isRunning 
              ? 'bg-glow/20 border-glow text-glow' 
              : 'bg-surface border-border text-muted hover:text-text'
          }`}
        >
          {isRunning ? 'Running' : 'Paused'}
        </button>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          Reset
        </button>
      </div>
      
      {/* Instructions - Collapsible */}
      <CollapsiblePanel title="F = D_KL + Surprisal" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          Click anywhere to place the system. It will minimize free energy by descending toward attractors (expected states).
        </div>
      </CollapsiblePanel>
    </div>
  );
}
