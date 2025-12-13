import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * ConfigurationAwarenessSim - Why modeling H(ω) is adaptive
 * 
 * Shows two agents side by side:
 * - "Blind" agent: No self-model of its own H(ω), just reacts
 * - "Aware" agent: Models its own cognitive horizon, can strategically navigate
 * 
 * Both try to reach a "goal thought" that requires a specific configuration.
 * The aware agent can see when it's in the wrong state and deliberately shift.
 * The blind agent flails, sometimes gets lucky.
 * 
 * Key insight: Self-modeling of H(ω) enables strategic state navigation —
 * "I need to calm down before I can think about this."
 */

const STATES = {
  stressed: { radius: 0.3, color: '#f87171', label: 'Stressed' },
  neutral: { radius: 0.55, color: '#facc15', label: 'Neutral' },
  calm: { radius: 0.75, color: '#60a5fa', label: 'Calm' },
  flow: { radius: 0.9, color: '#4ade80', label: 'Flow' },
};

const STATE_ORDER = ['stressed', 'neutral', 'calm', 'flow'];

function generateGoalThought() {
  // Goal thought is always at a distance requiring calm or flow state
  const angle = Math.random() * Math.PI * 2;
  const distance = 0.6 + Math.random() * 0.25; // Requires calm or flow
  return { angle, distance };
}

function generateThoughts(count = 16) {
  const thoughts = [];
  for (let i = 0; i < count; i++) {
    thoughts.push({
      angle: Math.random() * Math.PI * 2,
      distance: 0.15 + Math.random() * 0.75,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }
  return thoughts;
}

class Agent {
  constructor(x, y, isAware) {
    this.x = x;
    this.y = y;
    this.isAware = isAware;
    this.state = 'neutral';
    this.targetState = 'neutral';
    this.stateTransitionProgress = 1;
    this.currentRadius = STATES.neutral.radius;
    this.successes = 0;
    this.attempts = 0;
    this.lastAttemptTime = 0;
    this.isReaching = false;
    this.reachTarget = null;
    this.reachProgress = 0;
    this.waitingForStateChange = false;
    this.stateChangeTimer = 0;
  }
  
  getCurrentRadius() {
    return this.currentRadius;
  }
  
  canReach(thought) {
    return thought.distance <= this.currentRadius;
  }
  
  // Aware agent can "see" what state it needs
  getRequiredState(thought) {
    for (const state of STATE_ORDER) {
      if (thought.distance <= STATES[state].radius) {
        return state;
      }
    }
    return 'flow';
  }
  
  // Transition to a new state (takes time)
  transitionTo(newState) {
    if (this.state !== newState && !this.waitingForStateChange) {
      this.targetState = newState;
      this.waitingForStateChange = true;
      this.stateChangeTimer = 0;
    }
  }
  
  update(dt, goal) {
    // State transition logic
    if (this.waitingForStateChange) {
      this.stateChangeTimer += dt;
      // State changes take ~2 seconds
      if (this.stateChangeTimer > 2) {
        this.state = this.targetState;
        this.waitingForStateChange = false;
        this.stateChangeTimer = 0;
      }
    }
    
    // Smooth radius transition
    const targetRadius = STATES[this.state].radius;
    this.currentRadius += (targetRadius - this.currentRadius) * 0.05;
    
    // Attempt logic
    if (!this.isReaching && !this.waitingForStateChange) {
      this.lastAttemptTime += dt;
      
      // Try to reach goal periodically
      if (this.lastAttemptTime > 1.5) {
        this.lastAttemptTime = 0;
        
        if (this.isAware) {
          // Aware agent: check if goal is reachable, if not, change state first
          const requiredState = this.getRequiredState(goal);
          const currentStateIdx = STATE_ORDER.indexOf(this.state);
          const requiredStateIdx = STATE_ORDER.indexOf(requiredState);
          
          if (requiredStateIdx > currentStateIdx) {
            // Need a calmer state - deliberately transition
            const nextState = STATE_ORDER[currentStateIdx + 1];
            this.transitionTo(nextState);
          } else if (this.canReach(goal)) {
            // Can reach it now - go for it
            this.isReaching = true;
            this.reachTarget = goal;
            this.reachProgress = 0;
            this.attempts++;
          }
        } else {
          // Blind agent: just tries randomly, state drifts randomly
          // Random state drift
          if (Math.random() < 0.3) {
            const currentIdx = STATE_ORDER.indexOf(this.state);
            const drift = Math.random() < 0.5 ? -1 : 1;
            const newIdx = Math.max(0, Math.min(STATE_ORDER.length - 1, currentIdx + drift));
            this.state = STATE_ORDER[newIdx];
          }
          
          // Try to reach regardless of whether it's possible
          this.isReaching = true;
          this.reachTarget = goal;
          this.reachProgress = 0;
          this.attempts++;
        }
      }
    }
    
    // Reaching animation
    if (this.isReaching) {
      this.reachProgress += dt * 0.8;
      
      if (this.reachProgress >= 1) {
        // Check if successful
        if (this.canReach(this.reachTarget)) {
          this.successes++;
        }
        this.isReaching = false;
        this.reachTarget = null;
        this.reachProgress = 0;
      }
    }
  }
}

export function ConfigurationAwarenessSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);
  
  const [goal, setGoal] = useState(() => generateGoalThought());
  const [thoughts] = useState(() => generateThoughts(16));
  const [blindAgent] = useState(() => new Agent(width * 0.25, height / 2, false));
  const [awareAgent] = useState(() => new Agent(width * 0.75, height / 2, true));
  const [, forceUpdate] = useState(0);
  
  const panelWidth = width / 2;
  const maxRadius = Math.min(panelWidth, height) * 0.38;
  
  // Reset
  const handleReset = useCallback(() => {
    blindAgent.state = 'neutral';
    blindAgent.currentRadius = STATES.neutral.radius;
    blindAgent.successes = 0;
    blindAgent.attempts = 0;
    blindAgent.isReaching = false;
    blindAgent.waitingForStateChange = false;
    
    awareAgent.state = 'neutral';
    awareAgent.currentRadius = STATES.neutral.radius;
    awareAgent.successes = 0;
    awareAgent.attempts = 0;
    awareAgent.isReaching = false;
    awareAgent.waitingForStateChange = false;
    
    setGoal(generateGoalThought());
  }, [blindAgent, awareAgent]);
  
  // New goal
  const handleNewGoal = useCallback(() => {
    setGoal(generateGoalThought());
  }, []);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    lastTimeRef.current = performance.now();
    
    const animate = (timestamp) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;
      timeRef.current += dt;
      const time = timeRef.current;
      
      // Update agents
      blindAgent.update(dt, goal);
      awareAgent.update(dt, goal);
      
      // Clear
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      // Draw divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      
      // Draw each panel
      [
        { agent: blindAgent, cx: panelWidth / 2, label: 'Blind Agent', sublabel: 'No self-model of H(ω)' },
        { agent: awareAgent, cx: panelWidth + panelWidth / 2, label: 'Aware Agent', sublabel: 'Models own H(ω)' },
      ].forEach(({ agent, cx, label, sublabel }) => {
        const cy = height / 2;
        const stateColor = STATES[agent.state].color;
        const horizonRadius = agent.getCurrentRadius() * maxRadius;
        
        // H(ω) boundary
        const innerGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, horizonRadius);
        innerGradient.addColorStop(0, `${stateColor}12`);
        innerGradient.addColorStop(0.8, `${stateColor}08`);
        innerGradient.addColorStop(1, `${stateColor}03`);
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Boundary line
        ctx.beginPath();
        ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${stateColor}50`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // State change indicator
        if (agent.waitingForStateChange) {
          const progress = agent.stateChangeTimer / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, horizonRadius + 10, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
          ctx.strokeStyle = STATES[agent.targetState].color;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        
        // Draw background thoughts (faint)
        thoughts.forEach(t => {
          const tx = cx + Math.cos(t.angle) * t.distance * maxRadius;
          const ty = cy + Math.sin(t.angle) * t.distance * maxRadius;
          const isAccessible = t.distance <= agent.getCurrentRadius();
          
          ctx.beginPath();
          ctx.arc(tx, ty, 4, 0, Math.PI * 2);
          ctx.fillStyle = isAccessible ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)';
          ctx.fill();
        });
        
        // Draw goal thought
        const goalX = cx + Math.cos(goal.angle) * goal.distance * maxRadius;
        const goalY = cy + Math.sin(goal.angle) * goal.distance * maxRadius;
        const goalAccessible = agent.canReach(goal);
        
        // Goal glow
        const goalGlow = ctx.createRadialGradient(goalX, goalY, 0, goalX, goalY, 20);
        goalGlow.addColorStop(0, goalAccessible ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.2)');
        goalGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = goalGlow;
        ctx.beginPath();
        ctx.arc(goalX, goalY, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Goal core
        ctx.beginPath();
        ctx.arc(goalX, goalY, 8, 0, Math.PI * 2);
        ctx.fillStyle = goalAccessible ? '#facc15' : 'rgba(250, 204, 21, 0.4)';
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // "GOAL" label
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = goalAccessible ? '#facc15' : 'rgba(250, 204, 21, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText('GOAL', goalX, goalY - 14);
        
        // Reaching animation
        if (agent.isReaching && agent.reachTarget) {
          const reachX = cx + Math.cos(agent.reachTarget.angle) * agent.reachTarget.distance * maxRadius * agent.reachProgress;
          const reachY = cy + Math.sin(agent.reachTarget.angle) * agent.reachTarget.distance * maxRadius * agent.reachProgress;
          
          // Line from center to reach point
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(reachX, reachY);
          ctx.strokeStyle = agent.canReach(agent.reachTarget) ? 'rgba(74, 222, 128, 0.6)' : 'rgba(248, 113, 113, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Reach point
          ctx.beginPath();
          ctx.arc(reachX, reachY, 6, 0, Math.PI * 2);
          ctx.fillStyle = agent.canReach(agent.reachTarget) ? '#4ade80' : '#f87171';
          ctx.fill();
        }
        
        // Center (self)
        const selfGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15);
        selfGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        selfGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        selfGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = selfGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Labels
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, 25);
        
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText(sublabel, cx, 40);
        
        // State indicator
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = stateColor;
        ctx.fillText(`State: ${STATES[agent.state].label}`, cx, height - 50);
        
        // Success rate
        const rate = agent.attempts > 0 ? (agent.successes / agent.attempts * 100).toFixed(0) : '—';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`${agent.successes}/${agent.attempts} (${rate}%)`, cx, height - 30);
      });
      
      forceUpdate(n => n + 1);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, panelWidth, maxRadius, goal, thoughts, blindAgent, awareAgent]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Info panel */}
      <CollapsiblePanel title="Configuration Awareness" position="top-left" defaultOpen={!isMobile} width="w-64" isFullscreen={isFullscreen}>
        <div className="text-muted text-xs">
          Both agents try to reach the same goal thought. The <span className="text-glow">aware agent</span> can 
          see its own H(ω) boundary and strategically shift to calmer states. The blind agent 
          just reacts, drifting randomly.
        </div>
      </CollapsiblePanel>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={handleNewGoal}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          New Goal
        </button>
        <button
          onClick={handleReset}
          className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} bg-surface border border-border rounded font-mono text-muted hover:text-text transition-colors`}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
