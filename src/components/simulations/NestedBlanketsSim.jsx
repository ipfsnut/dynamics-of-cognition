import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * NestedBlanketsSim - Scale-Free Nested Markov Blankets
 * 
 * Demonstrates the hierarchical architecture:
 * SCALE           BLANKET BOUNDARY          INFERENCE PROBLEM
 * Cell            Membrane + ion channels   "What tissue am I part of?"
 * Organ           Tissue boundaries         "What body state should I help maintain?"
 * Organism        Skin + sensory surfaces   "What world am I in?"
 * Social          Communicative interface   "What do others know?"
 * 
 * Shows:
 * - Nested circles representing blankets at different scales
 * - Information flow constrained by blanket boundaries
 * - Zoom capability to explore different scales
 * - The same μ ⊥⊥ ψ | b structure at each level
 */

const SCALES = [
  { 
    id: 'molecular', 
    label: 'Molecular', 
    color: '#4ade80',
    innerLabel: 'protein states',
    blanketLabel: 'membrane channels',
    outerLabel: 'cytoplasm',
  },
  { 
    id: 'cellular', 
    label: 'Cellular', 
    color: '#60a5fa',
    innerLabel: 'organelles',
    blanketLabel: 'cell membrane',
    outerLabel: 'tissue matrix',
  },
  { 
    id: 'tissue', 
    label: 'Tissue', 
    color: '#a78bfa',
    innerLabel: 'cell collectives',
    blanketLabel: 'tissue boundary',
    outerLabel: 'organ system',
  },
  { 
    id: 'organism', 
    label: 'Organism', 
    color: '#f87171',
    innerLabel: 'neural states',
    blanketLabel: 'sensory/motor',
    outerLabel: 'environment',
  },
  { 
    id: 'social', 
    label: 'Social', 
    color: '#facc15',
    innerLabel: 'individual minds',
    blanketLabel: 'language/gesture',
    outerLabel: 'culture',
  },
];

export function NestedBlanketsSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const [activeScale, setActiveScale] = useState(3); // Start at organism level
  const [showLabels, setShowLabels] = useState(true);
  const [animateFlow, setAnimateFlow] = useState(true);
  const [particles, setParticles] = useState([]);
  
  // Initialize particles for information flow
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 40; i++) {
      const scaleIdx = Math.floor(Math.random() * SCALES.length);
      const angle = Math.random() * Math.PI * 2;
      newParticles.push({
        scaleIdx,
        angle,
        radialOffset: (Math.random() - 0.5) * 0.3,
        speed: 0.01 + Math.random() * 0.02,
        type: Math.random() > 0.5 ? 'sensory' : 'active',
      });
    }
    setParticles(newParticles);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) * 0.42;
    
    const animate = () => {
      time += 0.016;
      
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      // Draw nested blankets from outside in
      SCALES.slice().reverse().forEach((scale, reverseIdx) => {
        const idx = SCALES.length - 1 - reverseIdx;
        const radiusFraction = (idx + 1) / SCALES.length;
        const radius = maxRadius * radiusFraction;
        const isActive = idx === activeScale;
        
        // Outer region (external states ψ)
        if (idx === SCALES.length - 1) {
          ctx.fillStyle = `${scale.color}08`;
          ctx.fillRect(0, 0, width, height);
        }
        
        // Blanket ring (sensory + active states)
        const blanketWidth = 12 + (isActive ? 4 : 0);
        
        // Blanket glow
        const blanketGlow = ctx.createRadialGradient(
          cx, cy, radius - blanketWidth,
          cx, cy, radius + blanketWidth
        );
        blanketGlow.addColorStop(0, 'transparent');
        blanketGlow.addColorStop(0.3, `${scale.color}${isActive ? '30' : '15'}`);
        blanketGlow.addColorStop(0.5, `${scale.color}${isActive ? '50' : '25'}`);
        blanketGlow.addColorStop(0.7, `${scale.color}${isActive ? '30' : '15'}`);
        blanketGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = blanketGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, radius + blanketWidth, 0, Math.PI * 2);
        ctx.arc(cx, cy, radius - blanketWidth, 0, Math.PI * 2, true);
        ctx.fill();
        
        // Blanket stroke
        ctx.strokeStyle = `${scale.color}${isActive ? 'aa' : '50'}`;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Interior fill (internal states μ)
        const interiorGradient = ctx.createRadialGradient(
          cx, cy, 0,
          cx, cy, radius - blanketWidth
        );
        interiorGradient.addColorStop(0, `${scale.color}15`);
        interiorGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = interiorGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius - blanketWidth, 0, Math.PI * 2);
        ctx.fill();
        
        // Labels
        if (showLabels && isActive) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          
          // Scale label
          ctx.fillStyle = scale.color;
          ctx.font = 'bold 12px "JetBrains Mono", monospace';
          ctx.fillText(scale.label.toUpperCase(), cx, cy - radius - 25);
          
          // Component labels
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          
          // Interior
          ctx.fillText(`μ: ${scale.innerLabel}`, cx, cy);
          
          // Blanket (at angles)
          const blanketLabelRadius = radius;
          ctx.save();
          ctx.translate(cx + blanketLabelRadius * 0.7, cy - blanketLabelRadius * 0.7);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = scale.color + '99';
          ctx.fillText(`b: ${scale.blanketLabel}`, 0, 0);
          ctx.restore();
          
          // Exterior
          if (idx < SCALES.length - 1) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillText(`ψ: ${scale.outerLabel}`, cx, cy + radius + 35);
          }
        }
      });
      
      // Draw information flow particles
      if (animateFlow) {
        particles.forEach(p => {
          p.angle += p.speed * (p.type === 'sensory' ? -1 : 1);
          
          const scale = SCALES[p.scaleIdx];
          const radiusFraction = (p.scaleIdx + 1) / SCALES.length;
          const baseRadius = maxRadius * radiusFraction;
          const actualRadius = baseRadius + p.radialOffset * 20;
          
          const px = cx + Math.cos(p.angle) * actualRadius;
          const py = cy + Math.sin(p.angle) * actualRadius;
          
          // Particle glow
          const particleColor = p.type === 'sensory' ? '#4ade80' : '#facc15';
          ctx.fillStyle = particleColor + '60';
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = particleColor;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      
      // Draw scale indicator
      const indicatorX = 60;
      const indicatorStartY = height - 180;
      
      SCALES.forEach((scale, idx) => {
        const y = indicatorStartY + idx * 28;
        const isActive = idx === activeScale;
        
        ctx.fillStyle = isActive ? scale.color : `${scale.color}50`;
        ctx.beginPath();
        ctx.arc(indicatorX, y, isActive ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = `${isActive ? '11' : '10'}px "JetBrains Mono", monospace`;
        ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'left';
        ctx.fillText(scale.label, indicatorX + 15, y + 4);
        
        // Connection line
        if (idx < SCALES.length - 1) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(indicatorX, y + 10);
          ctx.lineTo(indicatorX, y + 18);
          ctx.stroke();
        }
      });
      
      // Mathematical formalism reminder
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText('μ ⊥⊥ ψ | b', cx, height - 30);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillText('same structure at every scale', cx, height - 15);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, activeScale, showLabels, animateFlow, particles]);
  
  const cycleScale = useCallback((direction) => {
    setActiveScale(s => {
      const next = s + direction;
      if (next < 0) return SCALES.length - 1;
      if (next >= SCALES.length) return 0;
      return next;
    });
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Scale Controls - Collapsible */}
      <CollapsibleControlPanel title="SCALE" position="bottom-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex gap-2">
          <button
            onClick={() => cycleScale(-1)}
            className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
          >
            ↓ Zoom In
          </button>
          <button
            onClick={() => cycleScale(1)}
            className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
          >
            ↑ Zoom Out
          </button>
        </div>
      </CollapsibleControlPanel>
      
      {/* Toggle Controls - Collapsible */}
      <CollapsibleControlPanel title="VIEW" position="top-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1 border rounded text-xs font-mono transition-colors ${
              showLabels
                ? 'bg-glow/20 border-glow text-glow'
                : 'bg-surface border-border text-muted'
            }`}
          >
            Labels
          </button>
          <button
            onClick={() => setAnimateFlow(!animateFlow)}
            className={`px-3 py-1 border rounded text-xs font-mono transition-colors ${
              animateFlow
                ? 'bg-glow/20 border-glow text-glow'
                : 'bg-surface border-border text-muted'
            }`}
          >
            Flow
          </button>
        </div>
      </CollapsibleControlPanel>
      
      {/* Info - Collapsible */}
      <CollapsiblePanel title="Nested Markov Blankets" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          The same mathematical structure repeats at every scale—from proteins 
          to societies. Each ring is a blanket: <span className="text-green-400">sensory</span> states 
          flow in, <span className="text-yellow-400">active</span> states flow out. 
          Use scale buttons to explore.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
