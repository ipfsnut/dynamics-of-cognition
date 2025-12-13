import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * EnergyAffordanceSim - The thermodynamic grounding of H(ω)
 * 
 * Extends CognitiveHorizonSim to show:
 * - ATP level as the driver of horizon radius
 * - Different thoughts have different metabolic costs to access
 * - Activity depletes ATP; rest recovers it
 * - Expensive thoughts (creative, abstract) become inaccessible first
 * 
 * Key insight: Configuration has costs. The horizon contracts not because
 * of abstract "stress" but because ATP reserves deplete. What cannot be
 * metabolically sustained cannot be thought.
 */

// Thought categories with metabolic costs
// Cost 1 = cheap (habitual), Cost 3 = expensive (creative/abstract)
const THOUGHT_CATEGORIES = [
  { id: 'creative', label: 'Creative Ideas', color: '#a78bfa', baseDistance: 0.75, cost: 3 },
  { id: 'abstract', label: 'Abstract Thought', color: '#818cf8', baseDistance: 0.8, cost: 3 },
  { id: 'planning', label: 'Long-term Planning', color: '#facc15', baseDistance: 0.65, cost: 2 },
  { id: 'empathy', label: 'Complex Empathy', color: '#f472b6', baseDistance: 0.6, cost: 2 },
  { id: 'analytical', label: 'Analysis', color: '#60a5fa', baseDistance: 0.5, cost: 2 },
  { id: 'memory', label: 'Episodic Memory', color: '#4ade80', baseDistance: 0.45, cost: 1 },
  { id: 'somatic', label: 'Body Awareness', color: '#2dd4bf', baseDistance: 0.3, cost: 1 },
  { id: 'immediate', label: 'Immediate Needs', color: '#f87171', baseDistance: 0.2, cost: 1 },
];

// Activity modes affecting ATP drain
const ACTIVITY_MODES = {
  resting: {
    label: 'Resting',
    drainRate: -0.15,  // Actually recovers
    color: '#4ade80',
    description: 'ATP regenerating — horizon expanding'
  },
  relaxed: {
    label: 'Relaxed',
    drainRate: 0.02,
    color: '#60a5fa',
    description: 'Minimal drain — sustainable indefinitely'
  },
  active: {
    label: 'Active Thinking',
    drainRate: 0.12,
    color: '#facc15',
    description: 'Moderate drain — hours of capacity'
  },
  demanding: {
    label: 'Demanding Work',
    drainRate: 0.35,
    color: '#fb923c',
    description: 'High drain — depletes within minutes'
  },
  intensive: {
    label: 'Intensive Focus',
    drainRate: 0.6,
    color: '#f87171',
    description: 'Rapid drain — unsustainable'
  }
};

function generateThoughts(count = 28) {
  const thoughts = [];
  
  THOUGHT_CATEGORIES.forEach(category => {
    const thoughtsInCategory = Math.floor(count / THOUGHT_CATEGORIES.length);
    for (let i = 0; i < thoughtsInCategory + 1; i++) {
      const baseAngle = (THOUGHT_CATEGORIES.indexOf(category) / THOUGHT_CATEGORIES.length) * Math.PI * 2;
      const angleVariance = (Math.random() - 0.5) * 1.2;
      const angle = baseAngle + angleVariance;
      
      // Distance based on cost - expensive thoughts are further out
      const costBonus = (category.cost - 1) * 0.1;
      const distVariance = (Math.random() - 0.5) * 0.2;
      const distance = Math.max(0.15, Math.min(0.9, category.baseDistance + costBonus + distVariance));
      
      thoughts.push({
        id: `${category.id}-${i}`,
        category: category.id,
        label: category.label,
        color: category.color,
        cost: category.cost,
        angle,
        distance,
        pulsePhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.08 + Math.random() * 0.15,
        driftAngle: Math.random() * Math.PI * 2,
      });
    }
  });
  
  return thoughts;
}

// Calculate horizon radius from ATP level
// Using sqrt scaling so depletion feels gradual at first, then accelerates
function atpToRadius(atp) {
  const minRadius = 0.2;  // Always keep immediate thoughts accessible
  const maxRadius = 0.88;
  return minRadius + (maxRadius - minRadius) * Math.pow(atp / 100, 0.6);
}

export function EnergyAffordanceSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const thoughtsRef = useRef(null);
  
  const [atp, setAtp] = useState(100);
  const [activity, setActivity] = useState('relaxed');
  const [hoveredThought, setHoveredThought] = useState(null);
  const [accessibleCount, setAccessibleCount] = useState(0);
  const [showCosts, setShowCosts] = useState(true);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.42;
  
  // Initialize thoughts
  useEffect(() => {
    thoughtsRef.current = generateThoughts(32);
  }, []);
  
  // ATP dynamics
  useEffect(() => {
    const interval = setInterval(() => {
      setAtp(prev => {
        const newAtp = prev - ACTIVITY_MODES[activity].drainRate;
        return Math.max(0, Math.min(100, newAtp));
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [activity]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      const thoughts = thoughtsRef.current;
      if (!thoughts) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      timeRef.current += 0.016;
      const time = timeRef.current;
      
      const currentRadius = atpToRadius(atp);
      
      // Clear
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      // Draw concentric zone rings
      for (let r = 0.2; r <= 1.0; r += 0.2) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * maxRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, 0.03)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // ATP-based color for horizon
      const atpColor = atp > 70 ? '#4ade80' : atp > 40 ? '#facc15' : atp > 20 ? '#fb923c' : '#f87171';
      
      const horizonRadius = currentRadius * maxRadius;
      
      // Outer glow (inaccessible zone)
      const outerGradient = ctx.createRadialGradient(
        centerX, centerY, horizonRadius,
        centerX, centerY, maxRadius
      );
      outerGradient.addColorStop(0, 'rgba(100, 100, 120, 0.15)');
      outerGradient.addColorStop(1, 'rgba(50, 50, 60, 0.05)');
      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2, true);
      ctx.fill();
      
      // Accessible zone gradient
      const innerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, horizonRadius
      );
      innerGradient.addColorStop(0, `${atpColor}18`);
      innerGradient.addColorStop(0.7, `${atpColor}08`);
      innerGradient.addColorStop(1, `${atpColor}03`);
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // H(ω) boundary
      const boundaryPulse = 1 + Math.sin(time * 2) * 0.015;
      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius * boundaryPulse, 0, Math.PI * 2);
      ctx.strokeStyle = `${atpColor}70`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Flickering edge zone
      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius * 1.06, 0, Math.PI * 2);
      ctx.strokeStyle = `${atpColor}25`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Count accessible thoughts
      let accessible = 0;
      
      // Draw thoughts
      thoughts.forEach(thought => {
        const driftX = Math.cos(time * thought.driftSpeed + thought.driftAngle) * 3;
        const driftY = Math.sin(time * thought.driftSpeed * 1.3 + thought.driftAngle) * 3;
        
        const x = centerX + Math.cos(thought.angle) * thought.distance * maxRadius + driftX;
        const y = centerY + Math.sin(thought.angle) * thought.distance * maxRadius + driftY;
        
        const distFromCenter = thought.distance;
        const isAccessible = distFromCenter <= currentRadius;
        const isAtBoundary = Math.abs(distFromCenter - currentRadius) < 0.07;
        
        if (isAccessible) accessible++;
        
        // Boundary thoughts flicker
        let alpha = isAccessible ? 1 : 0.15;
        if (isAtBoundary) {
          const flicker = Math.sin(time * 5 + thought.pulsePhase);
          alpha = isAccessible ? 
            0.5 + flicker * 0.5 : 
            0.08 + (flicker > 0.6 ? 0.25 : 0);
        }
        
        const baseSize = isMobile ? 6 : 8;
        const size = isAccessible ? baseSize : baseSize * 0.5;
        
        // Draw glow for accessible thoughts
        if (isAccessible || isAtBoundary) {
          const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
          glowGradient.addColorStop(0, `${thought.color}${Math.floor(alpha * 35).toString(16).padStart(2, '0')}`);
          glowGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Core
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${thought.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = `${thought.color}${Math.floor(alpha * 150).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Cost indicator
        if (showCosts && alpha > 0.3) {
          const costY = y + size + 8;
          ctx.font = `${isMobile ? 7 : 8}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          
          // Draw ATP cost symbols
          const costText = '⚡'.repeat(thought.cost);
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.8})`;
          ctx.fillText(costText, x, costY);
        }
        
        // Store for hover
        thought.screenX = x;
        thought.screenY = y;
        thought.isAccessible = isAccessible;
      });
      
      setAccessibleCount(accessible);
      
      // Draw center (self)
      const selfGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
      selfGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      selfGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      selfGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = selfGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('self', centerX, centerY + 22);
      
      // H(ω) label
      const labelAngle = -Math.PI / 4;
      const labelX = centerX + Math.cos(labelAngle) * horizonRadius;
      const labelY = centerY + Math.sin(labelAngle) * horizonRadius;
      
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = `${atpColor}bb`;
      ctx.textAlign = 'center';
      ctx.fillText('H(ω) boundary', labelX + 50, labelY - 10);
      
      ctx.beginPath();
      ctx.moveTo(labelX + 10, labelY - 5);
      ctx.lineTo(labelX + 2, labelY + 2);
      ctx.strokeStyle = `${atpColor}60`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Hovered thought info
      if (hoveredThought) {
        const t = thoughts.find(th => th.id === hoveredThought);
        if (t) {
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = t.color;
          ctx.textAlign = 'center';
          ctx.fillText(t.label, t.screenX, t.screenY - 18);
          
          ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
          ctx.fillText(`Cost: ${'⚡'.repeat(t.cost)}`, t.screenX, t.screenY - 5);
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillText(
            t.isAccessible ? '(accessible)' : '(beyond reach)', 
            t.screenX, 
            t.screenY + 8
          );
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
  }, [width, height, centerX, centerY, maxRadius, atp, hoveredThought, showCosts, isMobile]);
  
  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const thoughts = thoughtsRef.current;
    if (!thoughts) return;
    
    let found = null;
    thoughts.forEach(t => {
      const dx = x - t.screenX;
      const dy = y - t.screenY;
      if (Math.sqrt(dx * dx + dy * dy) < 18) {
        found = t.id;
      }
    });
    
    setHoveredThought(found);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setHoveredThought(null);
  }, []);
  
  // ATP bar color
  const atpBarColor = atp > 70 ? '#4ade80' : atp > 40 ? '#facc15' : atp > 20 ? '#fb923c' : '#f87171';
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Info panel */}
      <CollapsiblePanel title="Energy & Affordances" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted text-xs leading-relaxed">
          Configuration has costs. The cognitive horizon H(ω) contracts as ATP depletes. 
          Expensive thoughts (⚡⚡⚡) become inaccessible first.
        </div>
      </CollapsiblePanel>
      
      {/* ATP Meter */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'} bg-void/90 backdrop-blur-sm border border-border rounded-lg p-3 w-52`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-glow">ATP Level</span>
          <span className="text-xs font-mono" style={{ color: atpBarColor }}>
            {Math.round(atp)}%
          </span>
        </div>
        
        {/* ATP bar */}
        <div className="h-3 bg-surface rounded-full overflow-hidden mb-3">
          <div 
            className="h-full transition-all duration-100 rounded-full"
            style={{ 
              width: `${atp}%`,
              backgroundColor: atpBarColor,
              boxShadow: `0 0 8px ${atpBarColor}40`
            }}
          />
        </div>
        
        {/* Activity mode selector */}
        <div className="text-xs font-mono text-muted mb-2">Activity Mode</div>
        <div className="space-y-1">
          {Object.entries(ACTIVITY_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setActivity(key)}
              className={`w-full text-left px-2 py-1 rounded text-xs font-mono transition-colors ${
                activity === key
                  ? 'bg-surface border border-glow/50 text-text'
                  : 'border border-transparent text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              <span style={{ color: mode.color }}>●</span> {mode.label}
              <span className="text-muted ml-1">
                {mode.drainRate < 0 ? '↑' : mode.drainRate > 0.3 ? '↓↓' : mode.drainRate > 0.1 ? '↓' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Status panel */}
      <CollapsiblePanel title="METABOLIC STATUS" position="bottom-left" defaultOpen={!isMobile} width="w-56" isFullscreen={isFullscreen}>
        <div className="font-mono">
          <div className="text-2xl" style={{ color: atpBarColor }}>
            {accessibleCount}
          </div>
          <div className="text-xs text-muted">thoughts accessible</div>
        </div>
        <div className="text-xs text-muted mt-2">
          {ACTIVITY_MODES[activity].description}
        </div>
        <div className="mt-2 pt-2 border-t border-border">
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={showCosts}
              onChange={(e) => setShowCosts(e.target.checked)}
              className="rounded border-border"
            />
            Show ATP costs
          </label>
        </div>
      </CollapsiblePanel>
      
      {/* Legend */}
      <CollapsiblePanel title="METABOLIC COSTS" position="bottom-right" defaultOpen={false} width="w-44">
        <div className="text-xs text-muted mb-2">
          Higher cost = needs more ATP
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Habitual</span>
            <span className="text-amber-400">⚡</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Effortful</span>
            <span className="text-amber-400">⚡⚡</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Demanding</span>
            <span className="text-amber-400">⚡⚡⚡</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-border text-xs text-muted">
          As ATP depletes, expensive thoughts drop out first.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
