import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * ControllosphereSim - Cognitive Effort and Neural Energetics
 * 
 * Based on Holroyd's controllosphere concept:
 * - Intrinsic manifold: Low-dimensional, energy-efficient subspace (automatic processing)
 * - Controllosphere: Energy-inefficient region for controlled processing
 * 
 * Enhanced with H(ω) visualization:
 * - H(ω) zone: the region of mappings accessible at current configuration
 * - ACC monitoring: tracking prediction error reduction
 * - Shows the metabolic cost of accessing mappings outside H(ω)
 */

export function ControllosphereSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animationRef = useRef(null);
  
  const [controlSignal, setControlSignal] = useState(0);
  const [metabolicCost, setMetabolicCost] = useState(0);
  const [mode, setMode] = useState('automatic'); // 'automatic' | 'controlled'
  const [wasteAccumulation, setWasteAccumulation] = useState(0);
  const [accSignal, setAccSignal] = useState(0); // ACC prediction error monitoring
  const [mappingSuccess, setMappingSuccess] = useState(true);
  
  // Initialize state
  useEffect(() => {
    const cx = width / 2;
    const cy = height * 0.6;
    
    stateRef.current = {
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      energy: 100,
      inControllosphere: false,
      predictionError: 0,
      accHistory: [],
    };
  }, [width, height]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    // Landscape parameters
    const cx = width / 2;
    const manifoldY = height * 0.65; // Intrinsic manifold level
    const controllosphereY = height * 0.32; // Controllosphere level
    const hOmegaWidth = width * 0.35; // Width of H(ω) zone
    
    const animate = () => {
      time += 0.016;
      const state = stateRef.current;
      
      if (!state) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // === PHYSICS ===
      
      // Gravity toward intrinsic manifold (natural attractor)
      const gravityStrength = 0.3;
      const manifoldPull = (manifoldY - state.y) * 0.01 * gravityStrength;
      
      // Control signal pushes upward into controllosphere
      const controlPush = -controlSignal * 0.5;
      
      // Lateral centering (stronger within H(ω))
      const inHOmega = Math.abs(state.x - cx) < hOmegaWidth / 2;
      const lateralPull = (cx - state.x) * (inHOmega ? 0.008 : 0.003);
      
      // Apply forces
      state.vy += manifoldPull + controlPush;
      state.vx += lateralPull;
      
      // Damping
      state.vx *= 0.95;
      state.vy *= 0.95;
      
      // Random perturbation (less in H(ω))
      const perturbScale = inHOmega ? 0.2 : 0.4;
      state.vx += (Math.random() - 0.5) * perturbScale;
      state.vy += (Math.random() - 0.5) * perturbScale * 0.7;
      
      // Update position
      state.x += state.vx;
      state.y += state.vy;
      
      // Boundaries
      state.x = Math.max(60, Math.min(width - 60, state.x));
      state.y = Math.max(60, Math.min(height - 50, state.y));
      
      // Determine if in controllosphere
      const inControlled = state.y < (manifoldY + controllosphereY) / 2;
      state.inControllosphere = inControlled;
      setMode(inControlled ? 'controlled' : 'automatic');
      
      // ACC monitoring - prediction error based on distance from stable regions
      const distFromManifold = Math.abs(state.y - manifoldY);
      const distFromCenter = Math.abs(state.x - cx);
      state.predictionError = (distFromManifold * 0.3 + distFromCenter * 0.1) / 50;
      state.predictionError += Math.random() * 0.1; // Noise
      state.predictionError = Math.min(1, state.predictionError);
      
      // Track ACC history for visualization
      state.accHistory.push(state.predictionError);
      if (state.accHistory.length > 60) state.accHistory.shift();
      
      setAccSignal(state.predictionError);
      
      // Mapping success (inverse of sustained high prediction error)
      const avgError = state.accHistory.reduce((a, b) => a + b, 0) / state.accHistory.length;
      setMappingSuccess(avgError < 0.5);
      
      // Metabolic cost
      const elevationAboveManifold = Math.max(0, manifoldY - state.y);
      const currentCost = elevationAboveManifold * 0.01;
      setMetabolicCost(currentCost);
      
      // Waste accumulation (builds up in controllosphere)
      if (inControlled) {
        setWasteAccumulation(w => Math.min(100, w + 0.05));
      } else {
        setWasteAccumulation(w => Math.max(0, w - 0.02)); // Slow clearance
      }
      
      // === RENDERING ===
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      // Draw energy landscape
      const resolution = 4;
      for (let y = 0; y < height; y += resolution) {
        for (let x = 0; x < width; x += resolution) {
          // Energy is higher above manifold
          const relativeY = (manifoldY - y) / manifoldY;
          const energy = Math.max(0, relativeY);
          
          // Check if in H(ω) zone
          const inHOmegaZone = Math.abs(x - cx) < hOmegaWidth / 2 && y > manifoldY - 40;
          
          let r, g, b, a;
          if (y < controllosphereY + 50) {
            // Controllosphere region
            r = 248; g = 113; b = 113;
            a = 0.1 + energy * 0.15;
          } else if (y < manifoldY - 30) {
            // Transition zone
            r = 250; g = 204; b = 21;
            a = 0.05 + energy * 0.1;
          } else if (inHOmegaZone) {
            // H(ω) zone - slightly brighter
            r = 45; g = 212; b = 191;
            a = 0.12;
          } else {
            // Intrinsic manifold (outside H(ω))
            r = 45; g = 212; b = 191;
            a = 0.06 * (1 - (y - manifoldY) / (height - manifoldY));
          }
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillRect(x, y, resolution, resolution);
        }
      }
      
      // Draw H(ω) zone boundary
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - hOmegaWidth / 2, manifoldY - 40);
      ctx.lineTo(cx - hOmegaWidth / 2, height - 30);
      ctx.moveTo(cx + hOmegaWidth / 2, manifoldY - 40);
      ctx.lineTo(cx + hOmegaWidth / 2, height - 30);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // H(ω) label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(167, 139, 250, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText('H(ω)', cx, height - 15);
      ctx.fillStyle = 'rgba(167, 139, 250, 0.4)';
      ctx.fillText('accessible mappings', cx, height - 3);
      
      // Draw manifold line
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(50, manifoldY);
      ctx.lineTo(width - 50, manifoldY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label manifold
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
      ctx.textAlign = 'left';
      ctx.fillText('INTRINSIC MANIFOLD', 60, manifoldY + 18);
      
      // Draw controllosphere zone
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(50, controllosphereY);
      ctx.lineTo(width - 50, controllosphereY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label controllosphere
      ctx.fillStyle = 'rgba(248, 113, 113, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText('CONTROLLOSPHERE', width - 60, controllosphereY - 20);
      ctx.fillStyle = 'rgba(248, 113, 113, 0.4)';
      ctx.fillText('h ∉ H(ω)', width - 60, controllosphereY - 8);
      
      // Draw DLPFC control signal indicator
      if (controlSignal > 0) {
        const arrowStartY = manifoldY + 30;
        const arrowEndY = state.y + 20;
        
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.3 + controlSignal * 0.4})`;
        ctx.lineWidth = 2 + controlSignal * 3;
        ctx.beginPath();
        ctx.moveTo(state.x, arrowStartY);
        ctx.lineTo(state.x, arrowEndY);
        ctx.stroke();
        
        // Arrow head
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(state.x, arrowEndY);
        ctx.lineTo(state.x - 6, arrowEndY + 10);
        ctx.lineTo(state.x + 6, arrowEndY + 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(167, 139, 250, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('DLPFC', state.x, arrowStartY + 15);
      }
      
      // Draw ACC monitoring (right side)
      const accX = width - 45;
      const accY = height * 0.35;
      const accHeight = 80;
      
      // ACC background
      ctx.fillStyle = 'rgba(30, 30, 40, 0.8)';
      ctx.fillRect(accX - 20, accY - 10, 50, accHeight + 30);
      ctx.strokeStyle = 'rgba(100, 100, 120, 0.4)';
      ctx.strokeRect(accX - 20, accY - 10, 50, accHeight + 30);
      
      // ACC label
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(180, 180, 200, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('ACC', accX + 5, accY);
      
      // ACC signal history (mini chart)
      if (state.accHistory.length > 1) {
        ctx.strokeStyle = state.predictionError > 0.5 ? 'rgba(248, 113, 113, 0.7)' : 'rgba(45, 212, 191, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        state.accHistory.forEach((v, i) => {
          const hx = accX - 12 + (i / 60) * 35;
          const hy = accY + 15 + (1 - v) * (accHeight - 25);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        });
        ctx.stroke();
      }
      
      // ACC current value
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = state.predictionError > 0.5 ? 'rgba(248, 113, 113, 0.8)' : 'rgba(45, 212, 191, 0.8)';
      ctx.fillText(`PE: ${(state.predictionError * 100).toFixed(0)}%`, accX + 5, accY + accHeight + 10);
      
      // Draw state ball
      const ballGradient = ctx.createRadialGradient(
        state.x - 3, state.y - 3, 0,
        state.x, state.y, 15
      );
      
      if (state.inControllosphere) {
        ballGradient.addColorStop(0, '#ffffff');
        ballGradient.addColorStop(0.5, '#fca5a5');
        ballGradient.addColorStop(1, '#f87171');
      } else {
        ballGradient.addColorStop(0, '#ffffff');
        ballGradient.addColorStop(0.5, '#99f6e4');
        ballGradient.addColorStop(1, '#2dd4bf');
      }
      
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(state.x, state.y, 12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('ω', state.x, state.y - 20);
      
      // Draw waste particles if accumulated
      if (wasteAccumulation > 10) {
        const numParticles = Math.floor(wasteAccumulation / 5);
        for (let i = 0; i < numParticles; i++) {
          const angle = (i / numParticles) * Math.PI * 2 + time;
          const radius = 25 + Math.sin(time * 2 + i) * 5;
          const px = state.x + Math.cos(angle) * radius;
          const py = state.y + Math.sin(angle) * radius * 0.6;
          ctx.fillStyle = `rgba(234, 179, 8, ${0.2 + Math.random() * 0.2})`;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, controlSignal, wasteAccumulation]);
  
  const handleReset = useCallback(() => {
    const cx = width / 2;
    const cy = height * 0.6;
    stateRef.current = {
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      energy: 100,
      inControllosphere: false,
      predictionError: 0,
      accHistory: [],
    };
    setControlSignal(0);
    setWasteAccumulation(0);
  }, [width, height]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Control Signal - Collapsible */}
      <CollapsibleControlPanel title="DLPFC CONTROL" position="bottom-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={controlSignal}
          onChange={(e) => setControlSignal(parseFloat(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between mt-1 text-xs font-mono text-muted">
          <span>Relaxed</span>
          <span>Effortful</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-muted font-mono">MODE</div>
            <div className={`text-sm font-mono ${mode === 'controlled' ? 'text-red-400' : 'text-glow'}`}>
              {mode === 'controlled' ? 'h ∉ H(ω)' : 'h ∈ H(ω)'}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted font-mono">COST</div>
            <div className="text-sm font-mono text-yellow-400">
              {metabolicCost.toFixed(2)} ATP/s
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="text-xs text-muted font-mono mb-1">NEURAL WASTE</div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500/70 transition-all"
              style={{ width: `${wasteAccumulation}%` }}
            />
          </div>
          <div className="text-xs text-muted font-mono mt-1">
            {wasteAccumulation > 50 ? '⚠️ Configuration unstable' : 'β-amyloid, glutamate'}
          </div>
        </div>
      </CollapsibleControlPanel>
      
      {/* Controls */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'}`}>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          Reset
        </button>
      </div>
      
      {/* Info - Collapsible */}
      <CollapsiblePanel title="Controllosphere & H(ω)" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted text-xs leading-relaxed">
          The configuration ω naturally falls to the <span className="text-glow">intrinsic manifold</span> where 
          mappings in <span className="text-purple-400">H(ω)</span> are accessible. DLPFC pushes into the{' '}
          <span className="text-red-400">controllosphere</span> to access h ∉ H(ω)—metabolically expensive. 
          ACC monitors prediction error to evaluate if the mapping is working.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
