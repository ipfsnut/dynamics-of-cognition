import { useRef, useEffect, useState } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * InterfaceDynamicsSim v4 - Zoomed In: Cell-Cell Interfaces
 * 
 * PREMISE: Proto-valence emerges at the interface between adjacent cells.
 * 
 * Each cell is a Markov blanket:
 * - Internal states (metabolism, shown as internal particles)
 * - Membrane (the blanket boundary)
 * - Homeostatic rhythm (pulsing)
 * 
 * The INTERFACE between cells is where proto-feeling lives:
 * - Harmonious: smooth exchange, phases synced, colors blend
 * - Stressed: collision, buildup, sparks, desync
 * 
 * The coupling/sync at each interface IS the proto-valence.
 */

// Cell layout - organic cluster of ~7 cells
const CELL_LAYOUT = [
  { id: 0, x: 0, y: 0, radius: 1.0 },           // Center cell
  { id: 1, x: -0.9, y: -0.5, radius: 0.85 },   // Upper left
  { id: 2, x: 0.9, y: -0.5, radius: 0.9 },     // Upper right
  { id: 3, x: -0.95, y: 0.55, radius: 0.8 },   // Lower left
  { id: 4, x: 0.95, y: 0.55, radius: 0.85 },   // Lower right
  { id: 5, x: 0, y: -1.05, radius: 0.75 },     // Top
  { id: 6, x: 0, y: 1.1, radius: 0.8 },        // Bottom
];

// Which cells are adjacent (share interfaces)
const INTERFACES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],  // Center connects to all
  [1, 5], [2, 5],  // Top neighbors
  [3, 6], [4, 6],  // Bottom neighbors
  [1, 3], [2, 4],  // Side neighbors
];

const MODES = [
  {
    id: 'healthy',
    name: 'Healthy Tissue',
    description: 'All cells synchronized, smooth interfaces - tissue harmony',
    cellStates: [0.9, 0.85, 0.9, 0.85, 0.9, 0.8, 0.85],
    syncStrength: 0.9,
  },
  {
    id: 'local_stress',
    name: 'Local Stress',
    description: 'Center cell under stress - interfaces show strain',
    cellStates: [0.25, 0.7, 0.7, 0.65, 0.7, 0.75, 0.7],
    syncStrength: 0.5,
  },
  {
    id: 'spreading',
    name: 'Spreading Signal',
    description: 'Stress propagating outward from center',
    cellStates: [0.2, 0.4, 0.45, 0.4, 0.4, 0.5, 0.45],
    syncStrength: 0.3,
  },
  {
    id: 'inflammation',
    name: 'Inflammation',
    description: 'Multiple cells stressed, chaotic interfaces',
    cellStates: [0.3, 0.25, 0.35, 0.2, 0.3, 0.4, 0.25],
    syncStrength: 0.15,
  },
  {
    id: 'recovery',
    name: 'Recovery',
    description: 'Re-synchronizing after stress',
    cellStates: [0.6, 0.55, 0.6, 0.5, 0.55, 0.65, 0.6],
    syncStrength: 0.6,
  },
  {
    id: 'asymmetric',
    name: 'Asymmetric',
    description: 'Left side stressed, right side healthy - boundary tension',
    cellStates: [0.5, 0.25, 0.85, 0.2, 0.9, 0.5, 0.5],
    syncStrength: 0.4,
  },
];

export function InterfaceDynamicsSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [selectedMode, setSelectedMode] = useState(0);
  const timeRef = useRef(0);
  
  // Persistent state
  const cellsRef = useRef([]);
  const interfaceParticlesRef = useRef([]);
  
  const controlHeight = isMobile ? 120 : 140;
  const mode = MODES[selectedMode];
  
  // Initialize cells
  useEffect(() => {
    const cells = CELL_LAYOUT.map((layout, i) => ({
      ...layout,
      phase: Math.random() * Math.PI * 2,
      internalParticles: Array.from({ length: 15 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 0.7,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })),
    }));
    cellsRef.current = cells;
    
    // Initialize interface particles
    const particles = [];
    INTERFACES.forEach(([a, b], idx) => {
      for (let i = 0; i < 8; i++) {
        particles.push({
          interface: idx,
          cellA: a,
          cellB: b,
          t: Math.random(),  // Position along interface (0 = at A, 1 = at B)
          offset: (Math.random() - 0.5) * 0.3,  // Perpendicular offset
          phase: Math.random() * Math.PI * 2,
        });
      }
    });
    interfaceParticlesRef.current = particles;
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const canvasHeight = height - controlHeight;
    const centerX = width / 2;
    const centerY = canvasHeight / 2;
    const scale = Math.min(width, canvasHeight) * 0.28;
    const cellBaseRadius = scale * 0.42;
    
    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, canvasHeight);
      
      const { cellStates, syncStrength } = mode;
      const cells = cellsRef.current;
      
      // Update cell phases
      cells.forEach((cell, i) => {
        const health = cellStates[i];
        // Healthy cells have steady rhythm, stressed cells are erratic
        const baseSpeed = 1.5;
        const jitter = (1 - health) * Math.sin(t * 7 + i * 3) * 0.5;
        cell.phase += (baseSpeed + jitter) * 0.016;
        
        // Sync toward neighbors if sync strength is high
        if (syncStrength > 0.3) {
          const neighbors = INTERFACES
            .filter(([a, b]) => a === i || b === i)
            .map(([a, b]) => a === i ? b : a);
          
          neighbors.forEach(ni => {
            const neighborPhase = cells[ni].phase;
            const phaseDiff = neighborPhase - cell.phase;
            cell.phase += phaseDiff * syncStrength * 0.01;
          });
        }
      });
      
      // Draw interfaces FIRST (behind cells)
      INTERFACES.forEach(([a, b], idx) => {
        const cellA = cells[a];
        const cellB = cells[b];
        const healthA = cellStates[a];
        const healthB = cellStates[b];
        
        const ax = centerX + cellA.x * scale;
        const ay = centerY + cellA.y * scale;
        const bx = centerX + cellB.x * scale;
        const by = centerY + cellB.y * scale;
        
        // Interface midpoint and properties
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dist = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
        const angle = Math.atan2(by - ay, bx - ax);
        
        // Interface health is minimum of both cells
        const interfaceHealth = Math.min(healthA, healthB);
        
        // Phase alignment (how in-sync are the two cells?)
        const phaseDiff = Math.abs(Math.sin(cellA.phase) - Math.sin(cellB.phase));
        const phaseSync = 1 - phaseDiff;
        
        // Draw interface zone
        const interfaceWidth = 12 + (1 - interfaceHealth) * 8;
        
        // Gradient along interface - blends colors based on health
        const colorA = healthA > 0.5 ? [100, 200, 150] : [220, 80, 80];
        const colorB = healthB > 0.5 ? [100, 200, 150] : [220, 80, 80];
        
        // Draw interface glow
        const gradient = ctx.createLinearGradient(ax, ay, bx, by);
        const alphaA = Math.floor(50 + phaseSync * 40);
        const alphaB = Math.floor(50 + phaseSync * 40);
        gradient.addColorStop(0.3, `rgba(${colorA.join(',')}, ${alphaA / 255})`);
        gradient.addColorStop(0.7, `rgba(${colorB.join(',')}, ${alphaB / 255})`);
        
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(angle);
        
        // Interface zone background
        ctx.beginPath();
        ctx.ellipse(0, 0, dist * 0.35, interfaceWidth, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // If stressed, add visual tension
        if (interfaceHealth < 0.5) {
          // Jagged edges
          ctx.strokeStyle = `rgba(255, 100, 100, ${(1 - interfaceHealth) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let i = 0; i <= 20; i++) {
            const px = (i / 20 - 0.5) * dist * 0.7;
            const jag = Math.sin(t * 10 + i * 2) * (1 - interfaceHealth) * 5;
            if (i === 0) ctx.moveTo(px, interfaceWidth / 2 + jag);
            else ctx.lineTo(px, interfaceWidth / 2 + jag);
          }
          ctx.stroke();
          ctx.beginPath();
          for (let i = 0; i <= 20; i++) {
            const px = (i / 20 - 0.5) * dist * 0.7;
            const jag = Math.sin(t * 10 + i * 2 + 1) * (1 - interfaceHealth) * 5;
            if (i === 0) ctx.moveTo(px, -interfaceWidth / 2 + jag);
            else ctx.lineTo(px, -interfaceWidth / 2 + jag);
          }
          ctx.stroke();
        }
        
        // Sparks at very stressed interfaces
        if (interfaceHealth < 0.35) {
          const numSparks = Math.floor((1 - interfaceHealth) * 5);
          for (let i = 0; i < numSparks; i++) {
            if (Math.random() < 0.1) {
              const sx = (Math.random() - 0.5) * dist * 0.5;
              const sy = (Math.random() - 0.5) * interfaceWidth;
              ctx.beginPath();
              ctx.arc(sx, sy, 2 + Math.random() * 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 200, 100, ${0.5 + Math.random() * 0.5})`;
              ctx.fill();
            }
          }
        }
        
        ctx.restore();
      });
      
      // Draw interface particles (exchange between cells)
      interfaceParticlesRef.current.forEach(particle => {
        const { cellA, cellB } = particle;
        const cA = cells[cellA];
        const cB = cells[cellB];
        const healthA = cellStates[cellA];
        const healthB = cellStates[cellB];
        const interfaceHealth = Math.min(healthA, healthB);
        
        const ax = centerX + cA.x * scale;
        const ay = centerY + cA.y * scale;
        const bx = centerX + cB.x * scale;
        const by = centerY + cB.y * scale;
        
        // Movement speed depends on interface health
        // Healthy = smooth flow, stressed = erratic
        const baseSpeed = 0.008 * (0.5 + interfaceHealth * 0.5);
        const jitter = (1 - interfaceHealth) * (Math.random() - 0.5) * 0.02;
        particle.t += baseSpeed + jitter;
        
        // Bounce or wrap
        if (particle.t > 1) {
          particle.t = 1;
          particle.speed = -Math.abs(baseSpeed);
        } else if (particle.t < 0) {
          particle.t = 0;
          particle.speed = Math.abs(baseSpeed);
        }
        if (particle.speed) particle.t += particle.speed;
        
        // Calculate position
        const px = ax + (bx - ax) * particle.t;
        const py = ay + (by - ay) * particle.t;
        
        // Perpendicular offset (more chaotic when stressed)
        const perpAngle = Math.atan2(by - ay, bx - ax) + Math.PI / 2;
        const offsetMag = particle.offset * (10 + (1 - interfaceHealth) * 15);
        const wobble = (1 - interfaceHealth) * Math.sin(t * 8 + particle.phase) * 5;
        
        const finalX = px + Math.cos(perpAngle) * (offsetMag + wobble);
        const finalY = py + Math.sin(perpAngle) * (offsetMag + wobble);
        
        // Color based on health gradient
        const color = interfaceHealth > 0.5 
          ? `rgba(150, 220, 180, ${0.4 + interfaceHealth * 0.4})`
          : `rgba(220, 120, 120, ${0.4 + (1 - interfaceHealth) * 0.4})`;
        
        ctx.beginPath();
        ctx.arc(finalX, finalY, 2 + interfaceHealth * 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
      
      // Draw cells
      cells.forEach((cell, i) => {
        const health = cellStates[i];
        const cx = centerX + cell.x * scale;
        const cy = centerY + cell.y * scale;
        const radius = cellBaseRadius * cell.radius;
        
        // Pulse based on phase
        const pulse = Math.sin(cell.phase);
        const pulseRadius = radius * (1 + pulse * 0.05 * health);
        
        // Cell membrane
        const membraneGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseRadius);
        const coreColor = health > 0.5 
          ? [30, 60, 50]   // Healthy: dark teal
          : [60, 30, 30];  // Stressed: dark red
        const membraneColor = health > 0.5
          ? [80, 180, 130] // Healthy: teal
          : [200, 80, 80]; // Stressed: red
        
        membraneGradient.addColorStop(0, `rgba(${coreColor.join(',')}, 0.9)`);
        membraneGradient.addColorStop(0.7, `rgba(${coreColor.join(',')}, 0.8)`);
        membraneGradient.addColorStop(0.85, `rgba(${membraneColor.join(',')}, 0.6)`);
        membraneGradient.addColorStop(1, `rgba(${membraneColor.join(',')}, 0.2)`);
        
        ctx.beginPath();
        ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = membraneGradient;
        ctx.fill();
        
        // Membrane edge
        ctx.beginPath();
        ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${membraneColor.join(',')}, ${0.4 + health * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Internal particles (metabolism visualization)
        cell.internalParticles.forEach(p => {
          // Healthy cells: orderly circular motion
          // Stressed cells: chaotic motion
          const orderlyAngle = p.angle + t * p.speed;
          const chaoticAngle = p.angle + t * p.speed * 2 + Math.sin(t * 5 + p.phase) * 2;
          const angle = health * orderlyAngle + (1 - health) * chaoticAngle;
          
          const orderlyRadius = p.radius * radius * 0.6;
          const chaoticRadius = (p.radius + Math.sin(t * 3 + p.phase) * 0.2) * radius * 0.6;
          const r = health * orderlyRadius + (1 - health) * chaoticRadius;
          
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;
          
          const particleColor = health > 0.5
            ? `rgba(100, 200, 150, ${0.3 + pulse * 0.2})`
            : `rgba(200, 100, 100, ${0.3 + Math.abs(pulse) * 0.3})`;
          
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();
        });
        
        // Health indicator (small)
        if (!isMobile) {
          ctx.font = '9px system-ui';
          ctx.fillStyle = '#ffffff50';
          ctx.textAlign = 'center';
          ctx.fillText(`${Math.floor(health * 100)}%`, cx, cy + pulseRadius + 12);
        }
      });
      
      // Calculate overall tissue state (proto-valence)
      const avgHealth = cellStates.reduce((a, b) => a + b, 0) / cellStates.length;
      
      // Calculate interface harmony
      let totalInterfaceHarmony = 0;
      INTERFACES.forEach(([a, b]) => {
        const healthA = cellStates[a];
        const healthB = cellStates[b];
        const phaseDiff = Math.abs(Math.sin(cells[a].phase) - Math.sin(cells[b].phase));
        totalInterfaceHarmony += Math.min(healthA, healthB) * (1 - phaseDiff);
      });
      const avgInterfaceHarmony = totalInterfaceHarmony / INTERFACES.length;
      
      // Proto-valence emerges from interface states
      const protoValence = avgInterfaceHarmony;
      
      // Stats
      const statX = 15;
      let statY = 20;
      ctx.font = '11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff80';
      ctx.fillText(`Proto-valence: ${protoValence.toFixed(2)}`, statX, statY);
      
      if (!isMobile) {
        statY += 16;
        ctx.fillStyle = '#ffffff50';
        ctx.font = '10px system-ui';
        ctx.fillText(`Avg cell health: ${(avgHealth * 100).toFixed(0)}%`, statX, statY);
        statY += 14;
        ctx.fillText(`Interface harmony: ${(avgInterfaceHarmony * 100).toFixed(0)}%`, statX, statY);
        statY += 14;
        ctx.fillText(`Sync strength: ${(syncStrength * 100).toFixed(0)}%`, statX, statY);
      }
      
      // Legend
      if (!isMobile) {
        const legendX = width - 100;
        let legendY = 20;
        ctx.font = '9px system-ui';
        ctx.fillStyle = '#ffffff60';
        ctx.textAlign = 'left';
        ctx.fillText('Legend:', legendX, legendY);
        legendY += 14;
        
        ctx.fillStyle = 'rgba(80, 180, 130, 0.8)';
        ctx.beginPath();
        ctx.arc(legendX + 5, legendY - 3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff50';
        ctx.fillText('Healthy', legendX + 15, legendY);
        legendY += 14;
        
        ctx.fillStyle = 'rgba(200, 80, 80, 0.8)';
        ctx.beginPath();
        ctx.arc(legendX + 5, legendY - 3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff50';
        ctx.fillText('Stressed', legendX + 15, legendY);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, mode, isMobile, controlHeight]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <canvas
          ref={canvasRef}
          width={width}
          height={height - controlHeight}
          className="bg-void"
        />
        
        <CollapsiblePanel 
          title="Interface Dynamics" 
          position="top-left" 
          defaultOpen={!isMobile}
        >
          <div className="text-muted">
            Proto-valence emerges at the <span className="text-glow">interface</span> between 
            adjacent cells. Harmonious interfaces show smooth exchange and phase sync. 
            Stressed interfaces show collision and desync. The tissue's "feeling" is the 
            aggregate of all interface states.
          </div>
        </CollapsiblePanel>
      </div>
      
      <div className="p-2 sm:p-3 bg-void/90 border-t border-white/10" style={{ height: controlHeight }}>
        <div className="flex flex-wrap gap-1 mb-2">
          {MODES.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setSelectedMode(idx)}
              className={`px-2 py-1 rounded text-[10px] sm:text-xs transition-all ${
                selectedMode === idx
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
        
        <div className="text-[10px] sm:text-xs text-white/50 bg-white/5 rounded p-2">
          <span className="text-white/80 font-medium">{mode.name}:</span> {mode.description}
        </div>
      </div>
    </div>
  );
}
