import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * FatigueRecoverySim - Work/Rest Cycles and Metabolic Dynamics
 * 
 * Demonstrates:
 * - Waste accumulation during effortful (controllosphere) work
 * - Clearance during rest periods
 * - Capacity depletion and restoration
 * - How overwork leads to diminishing returns
 * - Learning: how repeated practice can shift mappings to intrinsic manifold
 */

export function FatigueRecoverySim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const stateRef = useRef(null);
  
  const [mode, setMode] = useState('idle'); // 'idle' | 'working' | 'resting' | 'sleeping'
  const [wasteLevel, setWasteLevel] = useState(0);
  const [capacity, setCapacity] = useState(100);
  const [performance, setPerformance] = useState(100);
  const [practiceLevel, setPracticeLevel] = useState(0); // 0-100, how much mapping has shifted to manifold
  const [sessionTime, setSessionTime] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  
  // Initialize state
  useEffect(() => {
    stateRef.current = {
      waste: 0,
      capacity: 100,
      practice: 0,
      particles: [], // waste particles for visualization
      glymphatic: [], // clearance flow particles
    };
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
      
      // === DYNAMICS ===
      
      // Work mode: accumulate waste, deplete capacity, build practice
      if (mode === 'working') {
        // Waste accumulates faster when capacity is low
        const wasteRate = 0.15 * (1 + (100 - state.capacity) * 0.01);
        state.waste = Math.min(100, state.waste + wasteRate);
        
        // Capacity depletes
        state.capacity = Math.max(0, state.capacity - 0.08);
        
        // Practice accumulates (learning)
        state.practice = Math.min(100, state.practice + 0.02);
        
        // Add waste particle
        if (Math.random() < 0.1) {
          state.particles.push({
            x: width * 0.3 + Math.random() * width * 0.4,
            y: height * 0.3 + Math.random() * height * 0.3,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 1,
            size: 2 + Math.random() * 3,
          });
        }
      }
      
      // Rest mode: slow clearance
      if (mode === 'resting') {
        state.waste = Math.max(0, state.waste - 0.03);
        state.capacity = Math.min(100, state.capacity + 0.02);
        
        // Glymphatic flow visualization
        if (Math.random() < 0.05 && state.waste > 5) {
          state.glymphatic.push({
            x: width * 0.2 + Math.random() * width * 0.6,
            y: height * 0.5,
            vy: 0.5 + Math.random() * 0.5,
            life: 1,
          });
        }
      }
      
      // Sleep mode: accelerated clearance
      if (mode === 'sleeping') {
        state.waste = Math.max(0, state.waste - 0.12);
        state.capacity = Math.min(100, state.capacity + 0.08);
        
        // More glymphatic flow
        if (Math.random() < 0.15 && state.waste > 2) {
          state.glymphatic.push({
            x: width * 0.2 + Math.random() * width * 0.6,
            y: height * 0.4,
            vy: 1 + Math.random() * 1,
            life: 1,
          });
        }
      }
      
      // Update particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;
        return p.life > 0;
      });
      
      state.glymphatic = state.glymphatic.filter(p => {
        p.y += p.vy;
        p.life -= 0.02;
        return p.life > 0 && p.y < height;
      });
      
      // Performance degrades with high waste
      const perf = Math.max(20, 100 - state.waste * 0.8);
      
      // Update React state
      setWasteLevel(state.waste);
      setCapacity(state.capacity);
      setPerformance(perf);
      setPracticeLevel(state.practice);
      
      if (mode === 'working') {
        setSessionTime(t => t + 0.016);
        setTotalWorkTime(t => t + 0.016);
      }
      
      // === RENDERING ===
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      // Draw brain region (simplified)
      const brainCx = width / 2;
      const brainCy = height * 0.4;
      const brainRadius = Math.min(width, height) * 0.25;
      
      // Brain outline
      const brainGradient = ctx.createRadialGradient(
        brainCx, brainCy, 0,
        brainCx, brainCy, brainRadius
      );
      
      // Color based on state
      if (mode === 'working') {
        brainGradient.addColorStop(0, 'rgba(248, 113, 113, 0.3)');
        brainGradient.addColorStop(0.7, 'rgba(248, 113, 113, 0.1)');
        brainGradient.addColorStop(1, 'rgba(248, 113, 113, 0.02)');
      } else if (mode === 'sleeping') {
        brainGradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        brainGradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.1)');
        brainGradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)');
      } else if (mode === 'resting') {
        brainGradient.addColorStop(0, 'rgba(45, 212, 191, 0.2)');
        brainGradient.addColorStop(0.7, 'rgba(45, 212, 191, 0.08)');
        brainGradient.addColorStop(1, 'rgba(45, 212, 191, 0.01)');
      } else {
        brainGradient.addColorStop(0, 'rgba(100, 100, 120, 0.2)');
        brainGradient.addColorStop(0.7, 'rgba(100, 100, 120, 0.08)');
        brainGradient.addColorStop(1, 'rgba(100, 100, 120, 0.01)');
      }
      
      ctx.fillStyle = brainGradient;
      ctx.beginPath();
      ctx.ellipse(brainCx, brainCy, brainRadius * 1.2, brainRadius, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(150, 150, 170, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw waste particles
      state.particles.forEach(p => {
        ctx.fillStyle = `rgba(234, 179, 8, ${p.life * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw glymphatic clearance
      state.glymphatic.forEach(p => {
        ctx.fillStyle = `rgba(99, 102, 241, ${p.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail
        ctx.strokeStyle = `rgba(99, 102, 241, ${p.life * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - 15);
        ctx.stroke();
      });
      
      // Draw gauges at bottom
      const gaugeY = height - 80;
      const gaugeHeight = 20;
      const gaugeWidth = (width - 100) / 3 - 20;
      
      // Waste gauge
      const wasteX = 40;
      ctx.fillStyle = 'rgba(40, 40, 50, 0.8)';
      ctx.fillRect(wasteX, gaugeY, gaugeWidth, gaugeHeight);
      ctx.fillStyle = state.waste > 70 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(234, 179, 8, 0.7)';
      ctx.fillRect(wasteX, gaugeY, gaugeWidth * (state.waste / 100), gaugeHeight);
      ctx.strokeStyle = 'rgba(100, 100, 120, 0.5)';
      ctx.strokeRect(wasteX, gaugeY, gaugeWidth, gaugeHeight);
      
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(180, 180, 200, 0.8)';
      ctx.textAlign = 'left';
      ctx.fillText('WASTE', wasteX, gaugeY - 5);
      ctx.fillText(`${state.waste.toFixed(0)}%`, wasteX + gaugeWidth - 30, gaugeY + 14);
      
      // Capacity gauge
      const capX = wasteX + gaugeWidth + 30;
      ctx.fillStyle = 'rgba(40, 40, 50, 0.8)';
      ctx.fillRect(capX, gaugeY, gaugeWidth, gaugeHeight);
      ctx.fillStyle = state.capacity < 30 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(45, 212, 191, 0.7)';
      ctx.fillRect(capX, gaugeY, gaugeWidth * (state.capacity / 100), gaugeHeight);
      ctx.strokeStyle = 'rgba(100, 100, 120, 0.5)';
      ctx.strokeRect(capX, gaugeY, gaugeWidth, gaugeHeight);
      
      ctx.fillStyle = 'rgba(180, 180, 200, 0.8)';
      ctx.fillText('CAPACITY', capX, gaugeY - 5);
      ctx.fillText(`${state.capacity.toFixed(0)}%`, capX + gaugeWidth - 30, gaugeY + 14);
      
      // Practice gauge (learning)
      const practX = capX + gaugeWidth + 30;
      ctx.fillStyle = 'rgba(40, 40, 50, 0.8)';
      ctx.fillRect(practX, gaugeY, gaugeWidth, gaugeHeight);
      ctx.fillStyle = 'rgba(167, 139, 250, 0.7)';
      ctx.fillRect(practX, gaugeY, gaugeWidth * (state.practice / 100), gaugeHeight);
      ctx.strokeStyle = 'rgba(100, 100, 120, 0.5)';
      ctx.strokeRect(practX, gaugeY, gaugeWidth, gaugeHeight);
      
      ctx.fillStyle = 'rgba(180, 180, 200, 0.8)';
      ctx.fillText('LEARNING', practX, gaugeY - 5);
      ctx.fillText(`${state.practice.toFixed(0)}%`, practX + gaugeWidth - 30, gaugeY + 14);
      
      // Mode indicator
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      
      let modeColor, modeText;
      switch(mode) {
        case 'working':
          modeColor = 'rgba(248, 113, 113, 0.9)';
          modeText = '⚡ WORKING (controllosphere)';
          break;
        case 'resting':
          modeColor = 'rgba(45, 212, 191, 0.9)';
          modeText = '🌿 RESTING (clearance)';
          break;
        case 'sleeping':
          modeColor = 'rgba(99, 102, 241, 0.9)';
          modeText = '🌙 SLEEPING (deep clearance)';
          break;
        default:
          modeColor = 'rgba(150, 150, 170, 0.7)';
          modeText = '○ IDLE';
      }
      
      ctx.fillStyle = modeColor;
      ctx.fillText(modeText, width / 2, 30);
      
      // Performance indicator
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = perf < 50 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(180, 180, 200, 0.7)';
      ctx.fillText(`Performance: ${perf.toFixed(0)}%`, width / 2, 50);
      
      // Warning if overworked
      if (state.waste > 80) {
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.fillText('⚠️ Waste critical — rest required', width / 2, height * 0.7);
      } else if (state.capacity < 20 && mode === 'working') {
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(234, 179, 8, 0.9)';
        ctx.fillText('⚠️ Capacity depleted — diminishing returns', width / 2, height * 0.7);
      }
      
      // Learning milestone
      if (state.practice > 50 && state.practice < 52) {
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(167, 139, 250, 0.9)';
        ctx.fillText('✨ Mapping shifting to intrinsic manifold', width / 2, height * 0.75);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, mode]);
  
  const handleReset = useCallback(() => {
    stateRef.current = {
      waste: 0,
      capacity: 100,
      practice: 0,
      particles: [],
      glymphatic: [],
    };
    setMode('idle');
    setSessionTime(0);
    setTotalWorkTime(0);
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Mode Controls */}
      <CollapsibleControlPanel title="ACTIVITY MODE" position="bottom-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode('working')}
            className={`px-3 py-2 rounded text-xs font-mono transition-colors ${
              mode === 'working' 
                ? 'bg-red-500/30 text-red-300 border border-red-500/50' 
                : 'bg-surface border border-border text-muted hover:text-text'
            }`}
          >
            ⚡ Work
          </button>
          <button
            onClick={() => setMode('resting')}
            className={`px-3 py-2 rounded text-xs font-mono transition-colors ${
              mode === 'resting' 
                ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50' 
                : 'bg-surface border border-border text-muted hover:text-text'
            }`}
          >
            🌿 Rest
          </button>
          <button
            onClick={() => setMode('sleeping')}
            className={`px-3 py-2 rounded text-xs font-mono transition-colors ${
              mode === 'sleeping' 
                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50' 
                : 'bg-surface border border-border text-muted hover:text-text'
            }`}
          >
            🌙 Sleep
          </button>
          <button
            onClick={() => setMode('idle')}
            className={`px-3 py-2 rounded text-xs font-mono transition-colors ${
              mode === 'idle' 
                ? 'bg-gray-500/30 text-gray-300 border border-gray-500/50' 
                : 'bg-surface border border-border text-muted hover:text-text'
            }`}
          >
            ○ Idle
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border text-xs font-mono">
          <div className="flex justify-between text-muted">
            <span>Session:</span>
            <span>{sessionTime.toFixed(1)}s</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Total work:</span>
            <span>{totalWorkTime.toFixed(1)}s</span>
          </div>
        </div>
      </CollapsibleControlPanel>
      
      {/* Reset */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'}`}>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          Reset
        </button>
      </div>
      
      {/* Info */}
      <CollapsiblePanel title="Fatigue & Recovery" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted text-xs leading-relaxed">
          <strong className="text-red-400">Work</strong> in the controllosphere accumulates waste and depletes capacity.{' '}
          <strong className="text-teal-400">Rest</strong> allows slow clearance.{' '}
          <strong className="text-indigo-400">Sleep</strong> enables deep glymphatic clearance.{' '}
          <strong className="text-purple-400">Learning</strong> gradually shifts the mapping to the intrinsic manifold.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
