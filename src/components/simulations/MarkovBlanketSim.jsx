import { useRef, useEffect, useCallback, useState } from 'react';
import Matter from 'matter-js';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * MarkovBlanketSim - Physics-based visualization of Markov blanket dynamics
 * 
 * Using Matter.js for:
 * - Real collision detection between particles
 * - Constraint-based membrane (blanket particles connected by springs)
 * - Physical information flow (forces propagate through the blanket)
 * 
 * The blanket is now a real physical structure - a ring of connected particles
 * that separates internal from external, with sensory particles on the outside
 * and active particles on the inside of the membrane.
 */

const { Engine, Bodies, Body, Composite, Constraint } = Matter;

// Particle type configurations
const TYPES = {
  internal: { 
    color: '#60a5fa', 
    label: 'μ (internal)',
    radius: 8,
    count: 12,
  },
  external: { 
    color: '#f87171', 
    label: 'ψ (external)',
    radius: 8,
    count: 16,
  },
  sensory: { 
    color: '#4ade80', 
    label: 's (sensory)',
    radius: 7,
    count: 16,
  },
  active: { 
    color: '#facc15', 
    label: 'a (active)',
    radius: 7,
    count: 16,
  },
};

// Create the physics world
function createWorld(width, height) {
  const engine = Engine.create({
    gravity: { x: 0, y: 0 },
  });
  
  const cx = width / 2;
  const cy = height / 2;
  const blanketRadius = Math.min(width, height) * 0.32;
  
  const bodies = {
    internal: [],
    external: [],
    sensory: [],
    active: [],
  };
  
  const constraints = [];
  
  // Create boundary walls (invisible)
  const wallThickness = 50;
  const walls = [
    Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true }),
    Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }),
    Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
    Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
  ];
  Composite.add(engine.world, walls);
  
  // Create sensory particles (outer ring of blanket)
  const sensoryCount = TYPES.sensory.count;
  for (let i = 0; i < sensoryCount; i++) {
    const angle = (i / sensoryCount) * Math.PI * 2;
    const x = cx + Math.cos(angle) * (blanketRadius + 12);
    const y = cy + Math.sin(angle) * (blanketRadius + 12);
    
    const body = Bodies.circle(x, y, TYPES.sensory.radius, {
      friction: 0.1,
      frictionAir: 0.02,
      restitution: 0.6,
    });
    body.particleType = 'sensory';
    body.originalAngle = angle;
    bodies.sensory.push(body);
  }
  
  // Create active particles (inner ring of blanket)
  const activeCount = TYPES.active.count;
  for (let i = 0; i < activeCount; i++) {
    const angle = (i / activeCount) * Math.PI * 2;
    const x = cx + Math.cos(angle) * (blanketRadius - 12);
    const y = cy + Math.sin(angle) * (blanketRadius - 12);
    
    const body = Bodies.circle(x, y, TYPES.active.radius, {
      friction: 0.1,
      frictionAir: 0.02,
      restitution: 0.6,
    });
    body.particleType = 'active';
    body.originalAngle = angle;
    bodies.active.push(body);
  }
  
  // Connect sensory particles to form outer membrane
  for (let i = 0; i < sensoryCount; i++) {
    const next = (i + 1) % sensoryCount;
    const c = Constraint.create({
      bodyA: bodies.sensory[i],
      bodyB: bodies.sensory[next],
      stiffness: 0.2,
      damping: 0.1,
    });
    c.constraintType = 'sensory-ring';
    constraints.push(c);
  }
  
  // Connect active particles to form inner membrane
  for (let i = 0; i < activeCount; i++) {
    const next = (i + 1) % activeCount;
    const c = Constraint.create({
      bodyA: bodies.active[i],
      bodyB: bodies.active[next],
      stiffness: 0.2,
      damping: 0.1,
    });
    c.constraintType = 'active-ring';
    constraints.push(c);
  }
  
  // Connect sensory to active (radial connections through blanket)
  for (let i = 0; i < Math.min(sensoryCount, activeCount); i++) {
    const c = Constraint.create({
      bodyA: bodies.sensory[i],
      bodyB: bodies.active[i],
      stiffness: 0.08,
      damping: 0.1,
      length: 24,
    });
    c.constraintType = 'radial';
    constraints.push(c);
  }
  
  // Anchor blanket to center (soft constraint to maintain shape)
  const centerAnchor = Bodies.circle(cx, cy, 5, { isStatic: true });
  Composite.add(engine.world, centerAnchor);
  
  // Soft radial constraints to keep blanket roughly circular
  bodies.sensory.forEach((body) => {
    const c = Constraint.create({
      bodyA: centerAnchor,
      bodyB: body,
      stiffness: 0.005,
      damping: 0.05,
      length: blanketRadius + 12,
    });
    c.constraintType = 'anchor';
    constraints.push(c);
  });
  
  bodies.active.forEach((body) => {
    const c = Constraint.create({
      bodyA: centerAnchor,
      bodyB: body,
      stiffness: 0.005,
      damping: 0.05,
      length: blanketRadius - 12,
    });
    c.constraintType = 'anchor';
    constraints.push(c);
  });
  
  // Create internal particles
  for (let i = 0; i < TYPES.internal.count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * (blanketRadius - 40);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    
    const body = Bodies.circle(x, y, TYPES.internal.radius, {
      friction: 0.05,
      frictionAir: 0.015,
      restitution: 0.8,
    });
    body.particleType = 'internal';
    bodies.internal.push(body);
  }
  
  // Create external particles
  for (let i = 0; i < TYPES.external.count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const minR = blanketRadius + 35;
    const maxR = Math.min(width, height) / 2 - 30;
    const r = minR + Math.random() * (maxR - minR);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    
    const body = Bodies.circle(x, y, TYPES.external.radius, {
      friction: 0.05,
      frictionAir: 0.015,
      restitution: 0.8,
    });
    body.particleType = 'external';
    bodies.external.push(body);
  }
  
  // Add all bodies to world
  Composite.add(engine.world, [...bodies.internal, ...bodies.external, ...bodies.sensory, ...bodies.active]);
  Composite.add(engine.world, constraints);
  
  return { engine, bodies, constraints, cx, cy, blanketRadius, centerAnchor };
}

// Custom forces for information flow and containment
function applyCustomForces(bodies, cx, cy, blanketRadius, flowEnabled, perturbation, width, height) {
  const forceMagnitude = 0.0003;
  const containmentForce = 0.001;
  
  // Internal particles: stay inside, interact with active states
  bodies.internal.forEach(body => {
    const dx = body.position.x - cx;
    const dy = body.position.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Soft containment inside blanket
    if (dist > blanketRadius - 30) {
      const pushBack = (dist - blanketRadius + 30) * containmentForce;
      Body.applyForce(body, body.position, {
        x: -dx / dist * pushBack,
        y: -dy / dist * pushBack,
      });
    }
    
    // Random Brownian motion
    Body.applyForce(body, body.position, {
      x: (Math.random() - 0.5) * forceMagnitude,
      y: (Math.random() - 0.5) * forceMagnitude,
    });
    
    // If flow enabled, internal states influence active states
    if (flowEnabled) {
      bodies.active.forEach(active => {
        const adx = active.position.x - body.position.x;
        const ady = active.position.y - body.position.y;
        const adist = Math.sqrt(adx * adx + ady * ady);
        
        if (adist < 60 && adist > 0) {
          const influence = 0.00005 * (60 - adist) / 60;
          Body.applyForce(active, active.position, {
            x: adx / adist * influence,
            y: ady / adist * influence,
          });
        }
      });
    }
  });
  
  // External particles: stay outside, interact with sensory states
  bodies.external.forEach(body => {
    const dx = body.position.x - cx;
    const dy = body.position.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Soft containment outside blanket
    if (dist < blanketRadius + 30) {
      const pushOut = (blanketRadius + 30 - dist) * containmentForce;
      Body.applyForce(body, body.position, {
        x: dx / dist * pushOut,
        y: dy / dist * pushOut,
      });
    }
    
    // Keep in bounds
    const maxDist = Math.min(width, height) / 2 - 20;
    if (dist > maxDist) {
      Body.applyForce(body, body.position, {
        x: -dx / dist * containmentForce * 2,
        y: -dy / dist * containmentForce * 2,
      });
    }
    
    // Random motion
    Body.applyForce(body, body.position, {
      x: (Math.random() - 0.5) * forceMagnitude,
      y: (Math.random() - 0.5) * forceMagnitude,
    });
    
    // If flow enabled, external states influence sensory states
    if (flowEnabled) {
      bodies.sensory.forEach(sensory => {
        const sdx = sensory.position.x - body.position.x;
        const sdy = sensory.position.y - body.position.y;
        const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
        
        if (sdist < 60 && sdist > 0) {
          const influence = 0.00005 * (60 - sdist) / 60;
          Body.applyForce(sensory, sensory.position, {
            x: -sdx / sdist * influence,
            y: -sdy / sdist * influence,
          });
        }
      });
    }
  });
  
  // Sensory -> Internal flow (perception)
  if (flowEnabled) {
    bodies.sensory.forEach(sensory => {
      bodies.internal.forEach(internal => {
        const dx = internal.position.x - sensory.position.x;
        const dy = internal.position.y - sensory.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 50 && dist > 0) {
          const influence = 0.00002 * (50 - dist) / 50;
          Body.applyForce(internal, internal.position, {
            x: -dx / dist * influence,
            y: -dy / dist * influence,
          });
        }
      });
    });
  }
  
  // Apply perturbation if active
  if (perturbation) {
    const { x, y, radius } = perturbation;
    [...bodies.internal, ...bodies.external, ...bodies.sensory, ...bodies.active].forEach(body => {
      const pdx = body.position.x - x;
      const pdy = body.position.y - y;
      const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
      
      if (pdist < radius && pdist > 0) {
        const force = 0.003 * (radius - pdist) / radius;
        Body.applyForce(body, body.position, {
          x: pdx / pdist * force,
          y: pdy / pdist * force,
        });
      }
    });
  }
}

export function MarkovBlanketSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const animationRef = useRef(null);
  const [hoveredType, setHoveredType] = useState(null);
  const [flowEnabled, setFlowEnabled] = useState(true);
  const [perturbation, setPerturbation] = useState(null);
  const [stats, setStats] = useState({ membrane: 0, flow: 0 });
  
  // Initialize physics world
  useEffect(() => {
    if (!width || !height) return;
    
    worldRef.current = createWorld(width, height);
    
    return () => {
      if (worldRef.current) {
        Composite.clear(worldRef.current.engine.world);
        Engine.clear(worldRef.current.engine);
      }
    };
  }, [width, height]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !worldRef.current) return;
    
    const ctx = canvas.getContext('2d');
    const { engine, bodies, constraints, cx, cy, blanketRadius } = worldRef.current;
    
    let frameCount = 0;
    
    const animate = () => {
      // Apply custom forces
      applyCustomForces(bodies, cx, cy, blanketRadius, flowEnabled, perturbation, width, height);
      
      // Step physics
      Engine.update(engine, 1000 / 60);
      
      // Calculate membrane stress
      let membraneStress = 0;
      let visibleConstraints = 0;
      constraints.forEach(c => {
        if (c.constraintType === 'anchor') return;
        if (c.bodyA && c.bodyB) {
          const dx = c.bodyA.position.x - c.bodyB.position.x;
          const dy = c.bodyA.position.y - c.bodyB.position.y;
          const currentLength = Math.sqrt(dx * dx + dy * dy);
          const restLength = c.length || 30;
          const strain = Math.abs(currentLength - restLength) / restLength;
          membraneStress += strain;
          visibleConstraints++;
        }
      });
      if (visibleConstraints > 0) membraneStress /= visibleConstraints;
      
      // Draw
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      
      // Draw background regions
      ctx.fillStyle = 'rgba(248, 113, 113, 0.03)';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) / 2 - 10, 0, Math.PI * 2);
      ctx.arc(cx, cy, blanketRadius + 20, 0, Math.PI * 2, true);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(96, 165, 250, 0.03)';
      ctx.beginPath();
      ctx.arc(cx, cy, blanketRadius - 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw constraints (membrane connections)
      constraints.forEach(constraint => {
        if (!constraint.bodyA || !constraint.bodyB) return;
        if (constraint.constraintType === 'anchor') return;
        
        const posA = constraint.bodyA.position;
        const posB = constraint.bodyB.position;
        
        let alpha = 1;
        if (hoveredType) {
          const typeA = constraint.bodyA.particleType;
          const typeB = constraint.bodyB.particleType;
          if (typeA !== hoveredType && typeB !== hoveredType) {
            alpha = 0.15;
          }
        }
        
        // Color based on constraint type
        if (constraint.constraintType === 'sensory-ring') {
          ctx.strokeStyle = `rgba(74, 222, 128, ${0.4 * alpha})`;
          ctx.lineWidth = 2;
        } else if (constraint.constraintType === 'active-ring') {
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.4 * alpha})`;
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = `rgba(45, 212, 191, ${0.2 * alpha})`;
          ctx.lineWidth = 1;
        }
        
        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);
        ctx.stroke();
      });
      
      // Draw information flow lines when enabled
      if (flowEnabled) {
        ctx.globalAlpha = 0.2;
        
        bodies.external.forEach(ext => {
          bodies.sensory.forEach(sens => {
            const dx = sens.position.x - ext.position.x;
            const dy = sens.position.y - ext.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 55) {
              const gradient = ctx.createLinearGradient(
                ext.position.x, ext.position.y,
                sens.position.x, sens.position.y
              );
              gradient.addColorStop(0, TYPES.external.color);
              gradient.addColorStop(1, TYPES.sensory.color);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = Math.max(1, (55 - dist) / 20);
              ctx.beginPath();
              ctx.moveTo(ext.position.x, ext.position.y);
              ctx.lineTo(sens.position.x, sens.position.y);
              ctx.stroke();
            }
          });
        });
        
        bodies.internal.forEach(int => {
          bodies.active.forEach(act => {
            const dx = act.position.x - int.position.x;
            const dy = act.position.y - int.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 55) {
              const gradient = ctx.createLinearGradient(
                int.position.x, int.position.y,
                act.position.x, act.position.y
              );
              gradient.addColorStop(0, TYPES.internal.color);
              gradient.addColorStop(1, TYPES.active.color);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = Math.max(1, (55 - dist) / 20);
              ctx.beginPath();
              ctx.moveTo(int.position.x, int.position.y);
              ctx.lineTo(act.position.x, act.position.y);
              ctx.stroke();
            }
          });
        });
        
        ctx.globalAlpha = 1;
      }
      
      // Draw particles
      const allBodies = [...bodies.internal, ...bodies.external, ...bodies.sensory, ...bodies.active];
      
      allBodies.forEach(body => {
        const type = body.particleType;
        const typeInfo = TYPES[type];
        const isHighlighted = hoveredType === null || hoveredType === type;
        const alpha = isHighlighted ? 1 : 0.2;
        
        // Glow
        const gradient = ctx.createRadialGradient(
          body.position.x, body.position.y, 0,
          body.position.x, body.position.y, typeInfo.radius * 3
        );
        gradient.addColorStop(0, typeInfo.color + Math.floor(alpha * 80).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, typeInfo.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.fillStyle = typeInfo.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, typeInfo.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = typeInfo.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = alpha * 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      
      // Draw perturbation ripple
      if (perturbation) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(perturbation.x, perturbation.y, perturbation.radius * (1 - perturbation.life), 0, Math.PI * 2);
        ctx.stroke();
        
        perturbation.life = (perturbation.life || 0) + 0.05;
        if (perturbation.life > 1) {
          setPerturbation(null);
        }
      }
      
      // Labels
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.textAlign = 'center';
      ctx.fillText('EXTERNAL STATES (ψ)', cx, 25);
      ctx.fillText('INTERNAL STATES (μ)', cx, cy + 4);
      
      // Update stats every 10 frames
      frameCount++;
      if (frameCount % 10 === 0) {
        setStats({
          membrane: Math.min(100, membraneStress * 200).toFixed(0),
          flow: flowEnabled ? 'Active' : 'Blocked',
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, hoveredType, flowEnabled, perturbation]);
  
  // Handle click for perturbation
  const handleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPerturbation({ x, y, radius: 100, life: 0 });
  }, []);
  
  // Reset
  const handleReset = useCallback(() => {
    if (worldRef.current) {
      Composite.clear(worldRef.current.engine.world);
      Engine.clear(worldRef.current.engine);
    }
    worldRef.current = createWorld(width, height);
  }, [width, height]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full cursor-pointer"
        onClick={handleClick}
      />
      
      {/* Legend - Collapsible */}
      <CollapsiblePanel title="STATE TYPES" position="bottom-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        {Object.entries(TYPES).map(([type, info]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 sm:gap-2 py-0.5 sm:py-1 cursor-pointer transition-opacity"
            style={{ opacity: hoveredType === null || hoveredType === type ? 1 : 0.3 }}
            onMouseEnter={() => setHoveredType(type)}
            onMouseLeave={() => setHoveredType(null)}
          >
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
              style={{ backgroundColor: info.color }}
            />
            <span className="text-text text-[10px] sm:text-xs">{info.label}</span>
          </div>
        ))}
        {!isMobile && (
          <div className="mt-3 pt-2 border-t border-border">
            <div className="flex justify-between text-muted">
              <span>Membrane tension:</span>
              <span className="text-glow">{stats.membrane}%</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Information flow:</span>
              <span className={flowEnabled ? 'text-glow' : 'text-red-400'}>{stats.flow}</span>
            </div>
          </div>
        )}
      </CollapsiblePanel>
      
      {/* Controls */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : isMobile ? 'top-2 right-2' : 'top-4 right-4'} flex gap-1.5 sm:gap-2`}>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-2 sm:px-3 py-1 text-[10px] sm:text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          Reset
        </button>
        <button
          onClick={() => setFlowEnabled(f => !f)}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-2 sm:px-3 py-1 text-[10px] sm:text-xs'} border rounded font-mono transition-colors ${
            flowEnabled 
              ? 'bg-glow/20 border-glow text-glow' 
              : 'bg-surface border-border text-muted hover:text-text'
          }`}
        >
          {flowEnabled ? 'Flow: ON' : 'Flow: OFF'}
        </button>
      </div>
      
      {/* Info - Collapsible */}
      <CollapsiblePanel title="μ ⊥⊥ ψ | b" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          The blanket is a physical membrane. Click anywhere to perturb the system 
          and watch information flow through sensory and active states.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
