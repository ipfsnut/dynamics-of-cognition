import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * AutopoiesisSim - Operational Closure Visualization
 * 
 * Demonstrates the autopoietic definition:
 * "A network of processes of production that recursively depend on each other"
 * 
 * Shows:
 * - A membrane boundary that must be actively maintained
 * - Internal processes that produce membrane components
 * - Membrane that enables internal processes
 * - The circular causality that defines living systems
 * - What happens when the cycle breaks (death)
 * 
 * Key insight: The system produces the components that produce the system.
 * Operationally closed, structurally coupled.
 */

const MEMBRANE_PARTICLES = 24;
const INTERNAL_PRODUCERS = 8;

function initializeSystem(width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.28;
  
  // Membrane particles forming the boundary
  const membrane = [];
  for (let i = 0; i < MEMBRANE_PARTICLES; i++) {
    const angle = (i / MEMBRANE_PARTICLES) * Math.PI * 2;
    membrane.push({
      angle,
      radius: radius,
      integrity: 1.0, // 1 = healthy, 0 = broken
      age: 0,
      maxAge: 300 + Math.random() * 200,
    });
  }
  
  // Internal producer units
  const producers = [];
  for (let i = 0; i < INTERNAL_PRODUCERS; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius * 0.6;
    producers.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      energy: 1.0,
      producing: false,
      targetMembrane: -1,
    });
  }
  
  // Resources from environment
  const resources = [];
  
  return { membrane, producers, resources, cx, cy, radius };
}

export function AutopoiesisSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const systemRef = useRef(null);
  const animationRef = useRef(null);
  
  const [membraneIntegrity, setMembraneIntegrity] = useState(1);
  const [isAlive, setIsAlive] = useState(true);
  const [metabolicRate, setMetabolicRate] = useState(1.0);
  const [showFlows, setShowFlows] = useState(true);
  
  useEffect(() => {
    systemRef.current = initializeSystem(width, height);
  }, [width, height]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    let frameCount = 0;
    
    const animate = () => {
      time += 0.016;
      frameCount++;
      const system = systemRef.current;
      
      if (!system) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const { membrane, producers, resources, cx, cy, radius } = system;
      
      // === AUTOPOIETIC DYNAMICS ===
      
      // 1. Membrane degradation (entropy)
      let totalIntegrity = 0;
      membrane.forEach((m, i) => {
        m.age += metabolicRate;
        
        // Natural decay
        if (m.age > m.maxAge * 0.7) {
          m.integrity -= 0.001 * metabolicRate;
        }
        
        m.integrity = Math.max(0, Math.min(1, m.integrity));
        totalIntegrity += m.integrity;
      });
      
      const avgIntegrity = totalIntegrity / membrane.length;
      setMembraneIntegrity(avgIntegrity);
      
      // Check death condition
      if (avgIntegrity < 0.3) {
        setIsAlive(false);
      }
      
      // 2. Spawn environmental resources
      if (frameCount % 30 === 0 && resources.length < 20) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * 1.5 + Math.random() * 50;
        resources.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          type: 'nutrient',
        });
      }
      
      // 3. Resources drift and can pass through membrane
      resources.forEach((r, i) => {
        r.x += r.vx;
        r.y += r.vy;
        
        // Drift toward center slightly (concentration gradient)
        const dx = cx - r.x;
        const dy = cy - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        r.vx += dx / dist * 0.01;
        r.vy += dy / dist * 0.01;
        
        // Check if passes through weak membrane spot
        const angle = Math.atan2(r.y - cy, r.x - cx);
        const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const membraneIdx = Math.floor((normalizedAngle / (Math.PI * 2)) * membrane.length);
        
        if (dist < radius + 10 && dist > radius - 30) {
          // Near membrane - can pass through based on integrity
          const membraneStrength = membrane[membraneIdx]?.integrity || 0;
          if (Math.random() > membraneStrength * 0.8) {
            // Passes through
            r.x += dx / dist * 5;
            r.y += dy / dist * 5;
          }
        }
      });
      
      // Remove resources that left bounds
      system.resources = resources.filter(r => {
        const d = Math.sqrt((r.x - cx) ** 2 + (r.y - cy) ** 2);
        return d < radius * 2 && r.x > 0 && r.x < width && r.y > 0 && r.y < height;
      });
      
      // 4. Producers move and work
      producers.forEach(p => {
        if (!isAlive) {
          p.energy *= 0.99;
          return;
        }
        
        // Brownian motion inside
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
        p.vx *= 0.95;
        p.vy *= 0.95;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Stay inside membrane
        const d = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
        if (d > radius - 20) {
          const angle = Math.atan2(p.y - cy, p.x - cx);
          p.x = cx + Math.cos(angle) * (radius - 25);
          p.y = cy + Math.sin(angle) * (radius - 25);
          p.vx *= -0.5;
          p.vy *= -0.5;
        }
        
        // Consume nearby resources
        system.resources = system.resources.filter(r => {
          const rd = Math.sqrt((r.x - p.x) ** 2 + (r.y - p.y) ** 2);
          if (rd < 20 && p.energy < 1.5) {
            p.energy += 0.3;
            return false;
          }
          return true;
        });
        
        // If energized, repair nearest weak membrane segment
        if (p.energy > 0.5 && !p.producing) {
          let weakest = -1;
          let weakestIntegrity = 1;
          
          membrane.forEach((m, i) => {
            if (m.integrity < weakestIntegrity && m.integrity < 0.8) {
              weakest = i;
              weakestIntegrity = m.integrity;
            }
          });
          
          if (weakest >= 0) {
            p.producing = true;
            p.targetMembrane = weakest;
          }
        }
        
        // Production process
        if (p.producing && p.targetMembrane >= 0) {
          const target = membrane[p.targetMembrane];
          if (target && p.energy > 0.1) {
            target.integrity += 0.005 * metabolicRate;
            p.energy -= 0.002 * metabolicRate;
            
            if (target.integrity >= 1) {
              target.integrity = 1;
              target.age = 0;
              target.maxAge = 300 + Math.random() * 200;
              p.producing = false;
              p.targetMembrane = -1;
            }
          } else {
            p.producing = false;
            p.targetMembrane = -1;
          }
        }
        
        p.energy = Math.max(0, Math.min(1.5, p.energy));
      });
      
      // === RENDERING ===
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      // Draw environmental gradient
      const envGradient = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius * 2);
      envGradient.addColorStop(0, 'transparent');
      envGradient.addColorStop(1, 'rgba(45, 212, 191, 0.03)');
      ctx.fillStyle = envGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw resources
      system.resources.forEach(r => {
        ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw membrane
      ctx.beginPath();
      membrane.forEach((m, i) => {
        const x = cx + Math.cos(m.angle) * m.radius;
        const y = cy + Math.sin(m.angle) * m.radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      
      // Membrane fill (living interior)
      const interiorGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      interiorGradient.addColorStop(0, isAlive ? 'rgba(45, 212, 191, 0.08)' : 'rgba(100, 100, 100, 0.05)');
      interiorGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = interiorGradient;
      ctx.fill();
      
      // Draw membrane segments with integrity coloring
      membrane.forEach((m, i) => {
        const next = membrane[(i + 1) % membrane.length];
        const x1 = cx + Math.cos(m.angle) * m.radius;
        const y1 = cy + Math.sin(m.angle) * m.radius;
        const x2 = cx + Math.cos(next.angle) * next.radius;
        const y2 = cy + Math.sin(next.angle) * next.radius;
        
        const avgI = (m.integrity + next.integrity) / 2;
        
        // Color based on integrity
        if (avgI > 0.7) {
          ctx.strokeStyle = `rgba(45, 212, 191, ${avgI})`;
        } else if (avgI > 0.4) {
          ctx.strokeStyle = `rgba(250, 204, 21, ${avgI})`;
        } else {
          ctx.strokeStyle = `rgba(248, 113, 113, ${avgI})`;
        }
        
        ctx.lineWidth = 3 + avgI * 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Membrane particle
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw producers
      producers.forEach(p => {
        // Producer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
        glow.addColorStop(0, `rgba(167, 139, 250, ${p.energy * 0.4})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Producer body
        ctx.fillStyle = `rgba(167, 139, 250, ${0.5 + p.energy * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Production line to target
        if (showFlows && p.producing && p.targetMembrane >= 0) {
          const target = membrane[p.targetMembrane];
          const tx = cx + Math.cos(target.angle) * target.radius;
          const ty = cy + Math.sin(target.angle) * target.radius;
          
          ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      
      // Labels
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillText('ENVIRONMENT (ψ)', cx, cy - radius - 30);
      ctx.fillText('INTERIOR (μ)', cx, cy);
      
      // Circular causality indicator
      if (showFlows && isAlive) {
        ctx.save();
        ctx.translate(cx, cy + radius + 50);
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText('membrane → enables → processes → produce → membrane', 0, 0);
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, isAlive, metabolicRate, showFlows]);
  
  const handleDamage = useCallback(() => {
    const system = systemRef.current;
    if (!system) return;
    
    // Damage random membrane segments
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * system.membrane.length);
      system.membrane[idx].integrity -= 0.3;
    }
  }, []);
  
  const handleReset = useCallback(() => {
    systemRef.current = initializeSystem(width, height);
    setIsAlive(true);
    setMetabolicRate(1.0);
  }, [width, height]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Status - Collapsible */}
      <CollapsibleControlPanel title="MEMBRANE INTEGRITY" position="bottom-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="w-full h-3 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full transition-all"
            style={{ 
              width: `${membraneIntegrity * 100}%`,
              backgroundColor: membraneIntegrity > 0.7 ? '#2dd4bf' : membraneIntegrity > 0.4 ? '#facc15' : '#f87171',
            }}
          />
        </div>
        <div className="mt-2 font-mono text-sm">
          {isAlive ? (
            <span className="text-glow">Autopoietic ✓</span>
          ) : (
            <span className="text-red-400">System death</span>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-border">
          <div className="font-mono text-xs text-muted mb-1">METABOLIC RATE</div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={metabolicRate}
            onChange={(e) => setMetabolicRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-glow"
          />
        </div>
      </CollapsibleControlPanel>
      
      {/* Controls - Collapsible */}
      <CollapsibleControlPanel title="ACTIONS" position="top-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleDamage}
            className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-red-500/20 border border-red-500 rounded font-mono text-red-400 hover:bg-red-500/30 transition-colors`}
          >
            Damage Membrane
          </button>
          <button
            onClick={() => setShowFlows(!showFlows)}
            className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} border rounded font-mono transition-colors ${
              showFlows
                ? 'bg-glow/20 border-glow text-glow'
                : 'bg-surface border-border text-muted'
            }`}
          >
            Show Flows
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
      <CollapsiblePanel title="Autopoiesis" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          The membrane enables processes that produce membrane components. 
          <span className="text-accent"> Purple producers</span> consume 
          <span className="text-green-400"> green nutrients</span> to repair 
          <span className="text-glow"> the boundary</span>. Circular causality.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
