import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * CognitiveHorizonSim - Visualizing the boundary of accessible thought
 * 
 * Shows:
 * - A mind with a visible "thought space" around it
 * - Thoughts/concepts as nodes scattered in this space
 * - H(ω) as the accessible region that expands/contracts with configuration state
 * - Thoughts at the boundary flicker - sometimes accessible, sometimes not
 * 
 * Key insight: Consciousness includes awareness of what thoughts are 
 * currently thinkable vs. unreachable. The phenomenology of "I can't 
 * think clearly right now" IS the experience of a contracted H(ω).
 */

// Thought nodes - scattered through mental space
const THOUGHT_CATEGORIES = [
  { id: 'creative', label: 'Creative Ideas', color: '#a78bfa', distance: 0.7 },
  { id: 'analytical', label: 'Analysis', color: '#60a5fa', distance: 0.5 },
  { id: 'memory', label: 'Memories', color: '#4ade80', distance: 0.4 },
  { id: 'planning', label: 'Planning', color: '#facc15', distance: 0.6 },
  { id: 'empathy', label: 'Empathy', color: '#f472b6', distance: 0.65 },
  { id: 'abstract', label: 'Abstract Thought', color: '#818cf8', distance: 0.8 },
  { id: 'immediate', label: 'Immediate Concerns', color: '#f87171', distance: 0.2 },
  { id: 'somatic', label: 'Body Awareness', color: '#2dd4bf', distance: 0.3 },
];

// Configuration states and their effect on H(ω) radius
const CONFIGURATIONS = {
  flow: { 
    label: 'Flow State', 
    radius: 0.85, 
    color: '#4ade80',
    description: 'Expanded access — creative and analytical thoughts both available'
  },
  calm: { 
    label: 'Calm', 
    radius: 0.7, 
    color: '#60a5fa',
    description: 'Broad access — most thoughts reachable with effort'
  },
  stressed: { 
    label: 'Stressed', 
    radius: 0.45, 
    color: '#facc15',
    description: 'Narrowed access — focus on immediate concerns'
  },
  overwhelmed: { 
    label: 'Overwhelmed', 
    radius: 0.25, 
    color: '#f87171',
    description: 'Contracted — only survival-relevant thoughts accessible'
  },
};

function generateThoughts(count = 24) {
  const thoughts = [];
  
  THOUGHT_CATEGORIES.forEach(category => {
    const thoughtsInCategory = Math.floor(count / THOUGHT_CATEGORIES.length);
    for (let i = 0; i < thoughtsInCategory; i++) {
      // Scatter thoughts at varying distances, clustered by category
      const baseAngle = Math.random() * Math.PI * 2;
      const angleVariance = (Math.random() - 0.5) * 0.8;
      const angle = baseAngle + angleVariance;
      
      // Distance from center, based on category's typical distance + variance
      const distVariance = (Math.random() - 0.5) * 0.3;
      const distance = Math.max(0.1, Math.min(0.95, category.distance + distVariance));
      
      thoughts.push({
        id: `${category.id}-${i}`,
        category: category.id,
        label: category.label,
        color: category.color,
        angle,
        distance,
        // For animation
        pulsePhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.1 + Math.random() * 0.2,
        driftAngle: Math.random() * Math.PI * 2,
      });
    }
  });
  
  return thoughts;
}

export function CognitiveHorizonSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const thoughtsRef = useRef(null);
  
  const [config, setConfig] = useState('calm');
  const [targetRadius, setTargetRadius] = useState(CONFIGURATIONS.calm.radius);
  const [currentRadius, setCurrentRadius] = useState(CONFIGURATIONS.calm.radius);
  const [hoveredThought, setHoveredThought] = useState(null);
  const [accessibleCount, setAccessibleCount] = useState(0);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.42;
  
  // Initialize thoughts
  useEffect(() => {
    thoughtsRef.current = generateThoughts(28);
  }, []);
  
  // Update target radius when config changes
  useEffect(() => {
    setTargetRadius(CONFIGURATIONS[config].radius);
  }, [config]);
  
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
      
      // Smooth radius transition
      const newRadius = currentRadius + (targetRadius - currentRadius) * 0.03;
      setCurrentRadius(newRadius);
      
      // Clear
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      // Draw concentric zone rings (faint)
      for (let r = 0.2; r <= 1.0; r += 0.2) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * maxRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw the H(ω) boundary - the cognitive horizon
      const horizonRadius = newRadius * maxRadius;
      
      // Outer glow (inaccessible zone indicator)
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
      const configColor = CONFIGURATIONS[config].color;
      innerGradient.addColorStop(0, `${configColor}15`);
      innerGradient.addColorStop(0.7, `${configColor}08`);
      innerGradient.addColorStop(1, `${configColor}03`);
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // H(ω) boundary line with animated pulse
      const boundaryPulse = 1 + Math.sin(time * 2) * 0.02;
      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius * boundaryPulse, 0, Math.PI * 2);
      ctx.strokeStyle = `${configColor}60`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Flickering boundary zone
      ctx.beginPath();
      ctx.arc(centerX, centerY, horizonRadius * 1.08, 0, Math.PI * 2);
      ctx.strokeStyle = `${configColor}20`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Count accessible thoughts
      let accessible = 0;
      
      // Draw thoughts
      thoughts.forEach(thought => {
        // Gentle drift animation
        const driftX = Math.cos(time * thought.driftSpeed + thought.driftAngle) * 3;
        const driftY = Math.sin(time * thought.driftSpeed * 1.3 + thought.driftAngle) * 3;
        
        const x = centerX + Math.cos(thought.angle) * thought.distance * maxRadius + driftX;
        const y = centerY + Math.sin(thought.angle) * thought.distance * maxRadius + driftY;
        
        // Is this thought accessible?
        const distFromCenter = thought.distance;
        const isAccessible = distFromCenter <= newRadius;
        const isAtBoundary = Math.abs(distFromCenter - newRadius) < 0.08;
        
        if (isAccessible) accessible++;
        
        // Boundary thoughts flicker
        let alpha = isAccessible ? 1 : 0.2;
        if (isAtBoundary) {
          // Flicker effect for boundary thoughts
          const flicker = Math.sin(time * 4 + thought.pulsePhase);
          alpha = isAccessible ? 
            0.5 + flicker * 0.5 : 
            0.1 + (flicker > 0.5 ? 0.3 : 0);
        }
        
        // Size based on accessibility
        const baseSize = isMobile ? 6 : 8;
        const size = isAccessible ? baseSize : baseSize * 0.6;
        
        // Draw thought node
        if (isAccessible || isAtBoundary) {
          // Glow for accessible thoughts
          const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
          glowGradient.addColorStop(0, `${thought.color}${Math.floor(alpha * 40).toString(16).padStart(2, '0')}`);
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
        ctx.strokeStyle = `${thought.color}${Math.floor(alpha * 180).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Store position for hover detection
        thought.screenX = x;
        thought.screenY = y;
        thought.isAccessible = isAccessible;
      });
      
      setAccessibleCount(accessible);
      
      // Draw center point (the "self")
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
      
      // Label for center
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('self', centerX, centerY + 22);
      
      // Draw H(ω) label on boundary
      const labelAngle = -Math.PI / 4;
      const labelX = centerX + Math.cos(labelAngle) * horizonRadius;
      const labelY = centerY + Math.sin(labelAngle) * horizonRadius;
      
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = `${configColor}aa`;
      ctx.textAlign = 'center';
      ctx.fillText('H(ω) boundary', labelX + 50, labelY - 10);
      
      // Arrow to boundary
      ctx.beginPath();
      ctx.moveTo(labelX + 10, labelY - 5);
      ctx.lineTo(labelX + 2, labelY + 2);
      ctx.strokeStyle = `${configColor}60`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Hovered thought info
      if (hoveredThought) {
        const t = thoughts.find(th => th.id === hoveredThought);
        if (t) {
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = t.color;
          ctx.textAlign = 'center';
          ctx.fillText(t.label, t.screenX, t.screenY - 15);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillText(
            t.isAccessible ? '(accessible)' : '(beyond reach)', 
            t.screenX, 
            t.screenY - 3
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
  }, [width, height, centerX, centerY, maxRadius, config, targetRadius, currentRadius, hoveredThought, isMobile]);
  
  // Mouse move for hover
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
      if (Math.sqrt(dx * dx + dy * dy) < 15) {
        found = t.id;
      }
    });
    
    setHoveredThought(found);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setHoveredThought(null);
  }, []);
  
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
      <CollapsiblePanel title="Cognitive Horizon" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          The boundary of accessible thought. Your body configuration (ω) determines 
          which thoughts lie within reach. Thoughts at the edge flicker in and out 
          of accessibility.
        </div>
      </CollapsiblePanel>
      
      {/* Configuration controls */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'} flex flex-col gap-2`}>
        <div className="bg-void/90 backdrop-blur-sm border border-border rounded-lg p-3 w-48">
          <div className="text-xs font-mono text-glow mb-2">Body Configuration (ω)</div>
          {Object.entries(CONFIGURATIONS).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setConfig(key)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs font-mono transition-colors mb-1 ${
                config === key
                  ? 'bg-surface border border-glow/50 text-text'
                  : 'border border-transparent text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              <span style={{ color: cfg.color }}>●</span> {cfg.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* State description */}
      <CollapsiblePanel title="H(ω) STATUS" position="bottom-left" defaultOpen={!isMobile} width="w-56" isFullscreen={isFullscreen}>
        <div className="font-mono">
          <div className="text-2xl" style={{ color: CONFIGURATIONS[config].color }}>
            {accessibleCount}
          </div>
          <div className="text-xs text-muted">thoughts accessible</div>
        </div>
        <div className="text-xs text-muted mt-2">
          {CONFIGURATIONS[config].description}
        </div>
      </CollapsiblePanel>
      
      {/* Legend */}
      <CollapsiblePanel title="THOUGHT TYPES" position="bottom-right" defaultOpen={false} width="w-40">
        {THOUGHT_CATEGORIES.slice(0, 6).map(cat => (
          <div key={cat.id} className="flex items-center gap-2 text-xs mb-1">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-muted">{cat.label}</span>
          </div>
        ))}
      </CollapsiblePanel>
    </div>
  );
}
