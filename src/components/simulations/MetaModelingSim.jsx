import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * MetaModelingSim - Consciousness as recursive self-modeling
 * 
 * Shows:
 * - Nested systems, each containing a model of its environment
 * - The "self" emerges as a model that models itself modeling
 * - Recursive depth creates the strange loop of consciousness
 * 
 * Key insight: Consciousness may arise when modeling achieves 
 * sufficient depth to include the modeler in the model
 */

// Agent class - each agent models its environment (including other agents)
class Agent {
  constructor(x, y, level = 0, parent = null) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.parent = parent;
    this.velocity = { x: 0, y: 0 };
    this.target = { x, y };
    this.model = null; // Internal model of environment
    this.modelAccuracy = 0;
    this.attention = 0; // Where attention is focused
    this.innerAgents = []; // Models of other agents (recursive!)
    this.color = level === 0 ? '#4ade80' : level === 1 ? '#60a5fa' : '#a78bfa';
    this.id = Math.random().toString(36).substr(2, 9);
  }
  
  // Create internal model of another agent
  modelAgent(other, depth = 0) {
    if (depth >= 2) return null; // Limit recursion
    
    const modeled = new Agent(
      other.x + (Math.random() - 0.5) * 20, // Imperfect model
      other.y + (Math.random() - 0.5) * 20,
      this.level + 1,
      this
    );
    modeled.modelAccuracy = 0.7 - depth * 0.2;
    return modeled;
  }
}

function initializeAgents(width, height, count = 3) {
  const agents = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.25;
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    agents.push(new Agent(x, y, 0));
  }
  
  // Each agent models the others
  agents.forEach((agent, i) => {
    agents.forEach((other, j) => {
      if (i !== j) {
        const model = agent.modelAgent(other, 0);
        if (model) {
          agent.innerAgents.push(model);
          
          // Recursive: the model also models (theory of mind)
          agents.forEach((other2, k) => {
            if (k !== j && k !== i) {
              const metaModel = model.modelAgent(other2, 1);
              if (metaModel) {
                model.innerAgents.push(metaModel);
              }
            }
          });
        }
      }
    });
    
    // Self-model (the crucial piece for consciousness)
    const selfModel = agent.modelAgent(agent, 0);
    if (selfModel) {
      selfModel.isSelfModel = true;
      agent.innerAgents.push(selfModel);
    }
  });
  
  return agents;
}

function updateAgents(agents, width, height, time) {
  const damping = 0.95;
  const cohesion = 0.001;
  const separation = 50;
  const separationForce = 0.5;
  
  agents.forEach(agent => {
    // Gentle wandering
    agent.target.x = width/2 + Math.cos(time * 0.5 + agent.x * 0.01) * width * 0.3;
    agent.target.y = height/2 + Math.sin(time * 0.7 + agent.y * 0.01) * height * 0.3;
    
    // Move toward target
    agent.velocity.x += (agent.target.x - agent.x) * cohesion;
    agent.velocity.y += (agent.target.y - agent.y) * cohesion;
    
    // Separation from others
    agents.forEach(other => {
      if (other.id === agent.id) return;
      const dx = agent.x - other.x;
      const dy = agent.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      if (dist < separation) {
        agent.velocity.x += (dx / dist) * separationForce * (separation - dist) / separation;
        agent.velocity.y += (dy / dist) * separationForce * (separation - dist) / separation;
      }
    });
    
    // Damping
    agent.velocity.x *= damping;
    agent.velocity.y *= damping;
    
    // Update position
    agent.x += agent.velocity.x;
    agent.y += agent.velocity.y;
    
    // Boundary
    agent.x = Math.max(50, Math.min(width - 50, agent.x));
    agent.y = Math.max(50, Math.min(height - 50, agent.y));
    
    // Update internal models (they track with noise)
    agent.innerAgents.forEach(inner => {
      const targetX = inner.isSelfModel ? agent.x : 
        agents.find(a => a.id !== agent.id)?.x || agent.x;
      const targetY = inner.isSelfModel ? agent.y : 
        agents.find(a => a.id !== agent.id)?.y || agent.y;
      
      // Models are imperfect - they lag and have noise
      inner.x += (targetX - inner.x) * 0.1 * inner.modelAccuracy;
      inner.y += (targetY - inner.y) * 0.1 * inner.modelAccuracy;
      inner.x += (Math.random() - 0.5) * 2 * (1 - inner.modelAccuracy);
      inner.y += (Math.random() - 0.5) * 2 * (1 - inner.modelAccuracy);
      
      // Recursive update
      inner.innerAgents.forEach(meta => {
        meta.x += (inner.x - meta.x) * 0.05 * meta.modelAccuracy;
        meta.y += (inner.y - meta.y) * 0.05 * meta.modelAccuracy;
        meta.x += (Math.random() - 0.5) * 3 * (1 - meta.modelAccuracy);
        meta.y += (Math.random() - 0.5) * 3 * (1 - meta.modelAccuracy);
      });
    });
    
    // Attention cycles between models
    agent.attention = (agent.attention + 0.02) % agent.innerAgents.length;
  });
  
  return agents;
}

function drawAgent(ctx, agent, scale = 1, showInternals = true, depth = 0) {
  const radius = (20 - depth * 5) * scale;
  
  // Outer glow
  const gradient = ctx.createRadialGradient(
    agent.x, agent.y, 0,
    agent.x, agent.y, radius * 2
  );
  gradient.addColorStop(0, agent.color + '40');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(agent.x, agent.y, radius * 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Main body
  ctx.fillStyle = agent.color + (depth === 0 ? 'ff' : '80');
  ctx.beginPath();
  ctx.arc(agent.x, agent.y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = agent.color;
  ctx.lineWidth = depth === 0 ? 2 : 1;
  ctx.stroke();
  
  // Self-model indicator
  if (agent.isSelfModel) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(agent.x, agent.y, radius + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  // Draw internal models (recursive!)
  if (showInternals && depth < 2) {
    agent.innerAgents.forEach((inner, i) => {
      // Connection line to internal model
      ctx.strokeStyle = inner.isSelfModel ? 'rgba(250, 204, 21, 0.3)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(agent.x, agent.y);
      ctx.lineTo(inner.x, inner.y);
      ctx.stroke();
      
      // Draw the internal model (smaller, offset toward parent)
      drawAgent(ctx, inner, scale * 0.6, showInternals, depth + 1);
    });
  }
}

export function MetaModelingSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const agentsRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showInternals, setShowInternals] = useState(true);
  const [recursionDepth, setRecursionDepth] = useState(2);
  
  // Initialize
  useEffect(() => {
    agentsRef.current = initializeAgents(width, height, 3);
  }, [width, height]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      const agents = agentsRef.current;
      
      if (!agents) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      timeRef.current += 0.016;
      
      // Update
      agentsRef.current = updateAgents(agents, width, height, timeRef.current);
      
      // Draw
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      // Draw "mind space" indicator for selected agent
      if (selectedAgent !== null && agents[selectedAgent]) {
        const agent = agents[selectedAgent];
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 100, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.textAlign = 'center';
        ctx.fillText('internal model space', agent.x, agent.y - 110);
      }
      
      // Draw agents
      agents.forEach((agent, i) => {
        const isSelected = selectedAgent === i;
        drawAgent(ctx, agent, 1, showInternals && isSelected, 0);
        
        // Label
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected ? agent.color : 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(`Agent ${i + 1}`, agent.x, agent.y + 35);
        
        if (isSelected) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillText(`(${agent.innerAgents.length} internal models)`, agent.x, agent.y + 48);
        }
      });
      
      // Draw legend for recursion levels
      const legendX = 20;
      const legendY = height - 80;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(legendX, legendY, 12, 12);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Agent (level 0)', legendX + 20, legendY + 10);
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(legendX, legendY + 18, 10, 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Model of other (level 1)', legendX + 20, legendY + 27);
      
      ctx.fillStyle = '#a78bfa';
      ctx.fillRect(legendX, legendY + 34, 8, 8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Meta-model (level 2)', legendX + 20, legendY + 42);
      
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(legendX + 5, legendY + 58, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Self-model', legendX + 20, legendY + 62);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, selectedAgent, showInternals, recursionDepth]);
  
  // Click to select agent
  const handleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const agents = agentsRef.current;
    if (!agents) return;
    
    // Find clicked agent
    let found = null;
    agents.forEach((agent, i) => {
      const dx = x - agent.x;
      const dy = y - agent.y;
      if (Math.sqrt(dx * dx + dy * dy) < 25) {
        found = i;
      }
    });
    
    setSelectedAgent(found);
  }, []);
  
  // Reset
  const handleReset = useCallback(() => {
    agentsRef.current = initializeAgents(width, height, 3);
    setSelectedAgent(null);
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
      
      {/* Info panel - Collapsible */}
      <CollapsiblePanel title="Nested Meta-Modeling" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          Each agent contains models of other agents (theory of mind) and a model 
          of itself (self-awareness). Click an agent to see its internal model space.
        </div>
        {selectedAgent !== null && (
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-accent">Self-model</span>
            <span className="text-muted"> = the strange loop that may constitute consciousness</span>
          </div>
        )}
      </CollapsiblePanel>
      
      {/* Controls */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'} flex gap-2`}>
        <button
          onClick={() => setShowInternals(!showInternals)}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} border rounded font-mono transition-colors ${
            showInternals
              ? 'bg-glow/20 border-glow text-glow'
              : 'bg-surface border-border text-muted hover:text-text'
          }`}
        >
          Internals
        </button>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          Reset
        </button>
      </div>
      
      {/* Recursion indicator - Collapsible */}
      <CollapsiblePanel title="MODELING DEPTH" position="bottom-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex gap-1">
          {[0, 1, 2].map(level => (
            <div
              key={level}
              className={`w-6 h-6 rounded flex items-center justify-center font-mono ${
                level === 0 ? 'bg-green-500/20 text-green-400' :
                level === 1 ? 'bg-blue-500/20 text-blue-400' :
                'bg-purple-500/20 text-purple-400'
              }`}
            >
              {level}
            </div>
          ))}
        </div>
        <div className="text-muted mt-1">Agent → Model → Meta-model</div>
      </CollapsiblePanel>
    </div>
  );
}
