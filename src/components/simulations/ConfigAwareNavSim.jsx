import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * ConfigAwareNavSim - Comparing blind vs. aware navigation of H(ω)
 * 
 * Shows:
 * - Two agents side by side, each trying to reach a target thought
 * - "Blind" agent: no model of its own H(ω), just flails randomly
 * - "Aware" agent: models its own configuration constraints, can strategically
 *   shift state to expand access
 * 
 * Key insight: Self-modeling of H(ω) is adaptive — it lets you navigate
 * to configurations where desired thoughts become accessible.
 * "Taking a walk to clear your head" = strategic ω navigation.
 */

// States available to agents
const STATES = {
  stressed: { radius: 0.3, color: '#f87171', label: 'Stressed', recovery: 0.002 },
  neutral: { radius: 0.5, color: '#94a3b8', label: 'Neutral', recovery: 0.005 },
  calm: { radius: 0.7, color: '#60a5fa', label: 'Calm', recovery: 0.008 },
  flow: { radius: 0.85, color: '#4ade80', label: 'Flow', recovery: 0.01 },
};

const STATE_ORDER = ['stressed', 'neutral', 'calm', 'flow'];

class Agent {
  constructor(x, y, isAware) {
    this.x = x;
    this.y = y;
    this.isAware = isAware;
    this.state = 'neutral';
    this.stateProgress = 0.5; // 0-1 within current state band
    this.targetThought = null;
    this.reachedTarget = false;
    this.attempts = 0;
    this.successes = 0;
    this.strategyLabel = '';
    this.actionCooldown = 0;
  }
  
  getCurrentRadius() {
    return STATES[this.state].radius;
  }
  
  // Aware agent can see where target is relative to current H(ω)
  canSeeTargetDistance() {
    if (!this.targetThought) return null;
    return this.targetThought.distance - this.getCurrentRadius();
  }
  
  // Strategic action: try to shift configuration
  takeStrategicAction() {
    if (this.actionCooldown > 0) {
      this.actionCooldown--;
      return;
    }
    
    if (!this.targetThought || this.reachedTarget) return;
    
    const gap = this.canSeeTargetDistance();
    
    if (this.isAware && gap !== null) {
      // Aware agent: strategic navigation
      if (gap > 0.05) {
        // Target is outside current H(ω) — need to expand
        // Strategy: move toward calmer states
        const currentIdx = STATE_ORDER.indexOf(this.state);
        if (currentIdx < STATE_ORDER.length - 1) {
          this.strategyLabel = 'Expanding access...';
          this.stateProgress += 0.02 + Math.random() * 0.02;
          
          if (this.stateProgress >= 1) {
            this.state = STATE_ORDER[currentIdx + 1];
            this.stateProgress = 0;
            this.strategyLabel = `→ ${STATES[this.state].label}`;
            this.actionCooldown = 30;
          }
        } else {
          this.strategyLabel = 'At max expansion';
        }
      } else {
        // Target is accessible!
        this.strategyLabel = 'Target in range!';
        this.reachedTarget = true;
        this.successes++;
      }
    } else {
      // Blind agent: random walk through states
      this.strategyLabel = 'Searching...';
      
      // Random state drift
      if (Math.random() < 0.03) {
        const currentIdx = STATE_ORDER.indexOf(this.state);
        const direction = Math.random() > 0.5 ? 1 : -1;
        const newIdx = Math.max(0, Math.min(STATE_ORDER.length - 1, currentIdx + direction));
        
        if (newIdx !== currentIdx) {
          this.state = STATE_ORDER[newIdx];
          this.stateProgress = 0.5;
          this.strategyLabel = `Drifted to ${STATES[this.state].label}`;
          this.actionCooldown = 20;
        }
      }
      
      // Check if accidentally reached target
      const radius = this.getCurrentRadius();
      if (this.targetThought && this.targetThought.distance <= radius) {
        this.reachedTarget = true;
        this.successes++;
        this.strategyLabel = 'Found it!';
      }
    }
  }
  
  // Assign a new target thought
  assignTarget(thoughts) {
    // Pick a thought that requires expansion (distance > 0.5)
    const challengingThoughts = thoughts.filter(t => t.distance > 0.5 && t.distance < 0.9);
    if (challengingThoughts.length > 0) {
      this.targetThought = challengingThoughts[Math.floor(Math.random() * challengingThoughts.length)];
    } else {
      this.targetThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    }
    this.reachedTarget = false;
    this.attempts++;
    this.state = 'stressed'; // Start in contracted state
    this.stateProgress = 0.5;
    this.strategyLabel = 'New target assigned';
  }
}

function generateThoughts() {
  const thoughts = [];
  const categories = [
    { color: '#a78bfa', label: 'Creative' },
    { color: '#60a5fa', label: 'Analytical' },
    { color: '#4ade80', label: 'Memory' },
    { color: '#facc15', label: 'Planning' },
  ];
  
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
    const distance = 0.25 + Math.random() * 0.65;
    const cat = categories[i % categories.length];
    
    thoughts.push({
      id: i,
      angle,
      distance,
      color: cat.color,
      label: cat.label,
    });
  }
  
  return thoughts;
}

export function ConfigAwareNavSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const thoughtsRef = useRef(null);
  const agentsRef = useRef(null);
  
  const [blindStats, setBlindStats] = useState({ attempts: 0, successes: 0 });
  const [awareStats, setAwareStats] = useState({ attempts: 0, successes: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const panelWidth = width / 2;
  const panelHeight = height;
  const maxRadius = Math.min(panelWidth, panelHeight) * 0.38;
  
  // Initialize
  useEffect(() => {
    thoughtsRef.current = generateThoughts();
    
    const blindAgent = new Agent(panelWidth / 2, panelHeight / 2, false);
    const awareAgent = new Agent(panelWidth / 2, panelHeight / 2, true);
    
    blindAgent.assignTarget(thoughtsRef.current);
    awareAgent.assignTarget(thoughtsRef.current);
    
    agentsRef.current = { blind: blindAgent, aware: awareAgent };
  }, [panelWidth, panelHeight]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      const thoughts = thoughtsRef.current;
      const agents = agentsRef.current;
      
      if (!thoughts || !agents) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      timeRef.current += 0.016 * speed;
      const time = timeRef.current;
      
      // Update agents
      if (!isPaused) {
        for (let i = 0; i < speed; i++) {
          agents.blind.takeStrategicAction();
          agents.aware.takeStrategicAction();
        }
        
        // Check for completed targets, assign new ones
        if (agents.blind.reachedTarget && agents.aware.reachedTarget) {
          setTimeout(() => {
            agents.blind.assignTarget(thoughts);
            agents.aware.assignTarget(thoughts);
          }, 1000 / speed);
        }
        
        setBlindStats({ attempts: agents.blind.attempts, successes: agents.blind.successes });
        setAwareStats({ attempts: agents.aware.attempts, successes: agents.aware.successes });
      }
      
      // Clear
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      // Divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      
      // Draw each panel
      const drawPanel = (agent, offsetX, label) => {
        const cx = offsetX + panelWidth / 2;
        const cy = panelHeight / 2;
        
        // Panel label
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillStyle = agent.isAware ? '#4ade80' : '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, 25);
        
        // Current state indicator
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = STATES[agent.state].color;
        ctx.fillText(`State: ${STATES[agent.state].label}`, cx, 42);
        
        // H(ω) boundary
        const radius = agent.getCurrentRadius() * maxRadius;
        
        // Accessible zone
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `${STATES[agent.state].color}15`);
        gradient.addColorStop(0.8, `${STATES[agent.state].color}08`);
        gradient.addColorStop(1, `${STATES[agent.state].color}03`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Boundary
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${STATES[agent.state].color}60`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw thoughts
        thoughts.forEach(thought => {
          const x = cx + Math.cos(thought.angle) * thought.distance * maxRadius;
          const y = cy + Math.sin(thought.angle) * thought.distance * maxRadius;
          
          const isAccessible = thought.distance <= agent.getCurrentRadius();
          const isTarget = agent.targetThought && agent.targetThought.id === thought.id;
          
          // Highlight target
          if (isTarget) {
            ctx.beginPath();
            ctx.arc(x, y, 18, 0, Math.PI * 2);
            ctx.strokeStyle = agent.reachedTarget ? '#4ade8080' : '#facc1580';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Animated ring if target
            if (!agent.reachedTarget) {
              const pulseRadius = 18 + Math.sin(time * 3) * 4;
              ctx.beginPath();
              ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
              ctx.strokeStyle = '#facc1540';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
          
          // Thought node
          const alpha = isAccessible ? 1 : 0.25;
          const size = isTarget ? 8 : 6;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `${thought.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        });
        
        // Center self
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Strategy label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(agent.strategyLabel, cx, panelHeight - 60);
        
        // If aware agent, show target distance indicator
        if (agent.isAware && agent.targetThought && !agent.reachedTarget) {
          const gap = agent.canSeeTargetDistance();
          if (gap > 0) {
            ctx.fillStyle = '#facc15';
            ctx.fillText(`Gap: ${(gap * 100).toFixed(0)}% expansion needed`, cx, panelHeight - 45);
          }
        }
        
        // Success rate
        const rate = agent.attempts > 0 ? (agent.successes / agent.attempts * 100).toFixed(0) : 0;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(`${agent.successes}/${agent.attempts} targets (${rate}%)`, cx, panelHeight - 25);
      };
      
      drawPanel(agents.blind, 0, 'BLIND AGENT');
      drawPanel(agents.aware, width / 2, 'AWARE AGENT');
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, panelWidth, panelHeight, maxRadius, isPaused, speed]);
  
  // Reset
  const handleReset = useCallback(() => {
    const thoughts = thoughtsRef.current;
    if (!thoughts) return;
    
    const blindAgent = new Agent(panelWidth / 2, panelHeight / 2, false);
    const awareAgent = new Agent(panelWidth / 2, panelHeight / 2, true);
    
    blindAgent.assignTarget(thoughts);
    awareAgent.assignTarget(thoughts);
    
    agentsRef.current = { blind: blindAgent, aware: awareAgent };
    setBlindStats({ attempts: 0, successes: 0 });
    setAwareStats({ attempts: 0, successes: 0 });
  }, [panelWidth, panelHeight]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Info */}
      <CollapsiblePanel title="Configuration-Aware Navigation" position="top-left" defaultOpen={!isMobile} width="w-64" isFullscreen={isFullscreen}>
        <div className="text-muted text-xs">
          Both agents start stressed (contracted H(ω)) and must reach a target thought. 
          The <span className="text-gray-400">blind</span> agent drifts randomly. 
          The <span className="text-green-400">aware</span> agent models its own constraints 
          and strategically expands access.
        </div>
      </CollapsiblePanel>
      
      {/* Controls */}
      <div className={`absolute ${isFullscreen ? 'top-16 right-4' : 'top-4 right-4'} flex gap-2`}>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} border rounded font-mono transition-colors ${
            isPaused
              ? 'bg-glow/20 border-glow text-glow'
              : 'bg-surface border-border text-muted hover:text-text'
          }`}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={() => setSpeed(speed === 1 ? 3 : speed === 3 ? 5 : 1)}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text`}
        >
          {speed}x
        </button>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text`}
        >
          Reset
        </button>
      </div>
      
      {/* Comparison stats */}
      <CollapsiblePanel title="COMPARISON" position="bottom-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <div className="text-gray-400 mb-1">Blind</div>
            <div className="text-lg">{blindStats.successes}/{blindStats.attempts}</div>
          </div>
          <div>
            <div className="text-green-400 mb-1">Aware</div>
            <div className="text-lg">{awareStats.successes}/{awareStats.attempts}</div>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  );
}
