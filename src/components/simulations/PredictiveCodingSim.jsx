import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * PredictiveCodingSim - Visualization of hierarchical predictive coding
 * 
 * Shows:
 * - Multiple levels of a cortical hierarchy
 * - Top-down predictions flowing downward
 * - Bottom-up prediction errors flowing upward
 * - Each level tries to predict the level below
 * 
 * Key equation: ε_i = x_i - g_i(μ_{i+1})
 * Where ε is prediction error, x is actual activity, g is prediction function
 */

const LEVELS = 4;
const NODES_PER_LEVEL = [8, 6, 4, 2]; // More nodes at bottom (sensory), fewer at top (abstract)
const LEVEL_LABELS = ['Sensory Input', 'Feature Detection', 'Object Representation', 'Abstract Concepts'];

function createNode(x, y, level, index) {
  return {
    x, y, level, index,
    activity: Math.random() * 0.5, // Current activity
    prediction: 0, // Prediction from level above
    error: 0, // Prediction error
    targetActivity: Math.random() * 0.5,
  };
}

function initializeNetwork(width, height) {
  const nodes = [];
  const levelHeight = height / (LEVELS + 1);
  
  for (let level = 0; level < LEVELS; level++) {
    const nodeCount = NODES_PER_LEVEL[level];
    const levelY = height - levelHeight * (level + 1);
    const levelWidth = width * 0.7;
    const startX = (width - levelWidth) / 2;
    
    for (let i = 0; i < nodeCount; i++) {
      const x = startX + (levelWidth / (nodeCount + 1)) * (i + 1);
      nodes.push(createNode(x, levelY, level, i));
    }
  }
  
  return nodes;
}

function getNodesAtLevel(nodes, level) {
  return nodes.filter(n => n.level === level);
}

// Simulate one step of predictive coding
function updateNetwork(nodes, inputPattern, learningRate = 0.1) {
  // 1. Set sensory input (level 0)
  const sensoryNodes = getNodesAtLevel(nodes, 0);
  sensoryNodes.forEach((node, i) => {
    node.targetActivity = inputPattern[i % inputPattern.length];
    node.activity = node.activity * 0.8 + node.targetActivity * 0.2;
  });
  
  // 2. Bottom-up pass: compute prediction errors
  for (let level = 0; level < LEVELS - 1; level++) {
    const currentNodes = getNodesAtLevel(nodes, level);
    const upperNodes = getNodesAtLevel(nodes, level + 1);
    
    // Each upper node predicts a pattern in the level below
    currentNodes.forEach(node => {
      // Simple prediction: weighted average of upper level
      let prediction = 0;
      upperNodes.forEach(upper => {
        const dist = Math.abs(node.index - upper.index * (NODES_PER_LEVEL[level] / NODES_PER_LEVEL[level + 1]));
        const weight = Math.exp(-dist * dist / 4);
        prediction += upper.activity * weight;
      });
      prediction /= upperNodes.length;
      
      node.prediction = prediction;
      node.error = node.activity - prediction;
    });
  }
  
  // 3. Top-down pass: update beliefs to reduce error
  for (let level = LEVELS - 1; level >= 1; level--) {
    const currentNodes = getNodesAtLevel(nodes, level);
    const lowerNodes = getNodesAtLevel(nodes, level - 1);
    
    currentNodes.forEach(upper => {
      // Adjust activity based on prediction errors from below
      let totalError = 0;
      lowerNodes.forEach(lower => {
        const dist = Math.abs(lower.index - upper.index * (NODES_PER_LEVEL[level - 1] / NODES_PER_LEVEL[level]));
        const weight = Math.exp(-dist * dist / 4);
        totalError += lower.error * weight;
      });
      
      upper.activity += learningRate * totalError / lowerNodes.length;
      upper.activity = Math.max(0, Math.min(1, upper.activity));
    });
  }
  
  return nodes;
}

export function PredictiveCodingSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef(null);
  const animationRef = useRef(null);
  const [inputType, setInputType] = useState('sine');
  const timeRef = useRef(0);
  const [showErrors, setShowErrors] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);
  
  // Initialize
  useEffect(() => {
    nodesRef.current = initializeNetwork(width, height);
  }, [width, height]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      const nodes = nodesRef.current;
      if (!nodes) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      timeRef.current += 0.02;
      const t = timeRef.current;
      
      // Generate input pattern based on type
      let inputPattern = [];
      const sensoryCount = NODES_PER_LEVEL[0];
      
      if (inputType === 'sine') {
        for (let i = 0; i < sensoryCount; i++) {
          inputPattern.push(0.5 + 0.4 * Math.sin(t * 2 + i * 0.5));
        }
      } else if (inputType === 'step') {
        const active = Math.floor((t % 4) / 4 * sensoryCount);
        for (let i = 0; i < sensoryCount; i++) {
          inputPattern.push(i === active ? 0.9 : 0.1);
        }
      } else if (inputType === 'random') {
        for (let i = 0; i < sensoryCount; i++) {
          inputPattern.push(nodesRef.current[i]?.targetActivity || 0.5);
        }
        // Occasionally change random pattern
        if (Math.random() < 0.02) {
          const idx = Math.floor(Math.random() * sensoryCount);
          inputPattern[idx] = Math.random();
        }
      }
      
      // Update network
      nodesRef.current = updateNetwork(nodes, inputPattern);
      
      // Draw
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      // Draw level labels
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      const levelHeight = height / (LEVELS + 1);
      
      for (let level = 0; level < LEVELS; level++) {
        const y = height - levelHeight * (level + 1);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText(LEVEL_LABELS[level], 80, y + 4);
        
        // Level line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(90, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
      }
      
      // Draw arrows (prediction and error flows)
      ctx.textAlign = 'center';
      
      // Arrow labels
      ctx.fillStyle = 'rgba(250, 204, 21, 0.6)';
      ctx.fillText('← predictions', width - 60, height / 2 - 20);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.fillText('errors →', width - 60, height / 2 + 20);
      
      // Draw connections between levels
      for (let level = 0; level < LEVELS - 1; level++) {
        const currentNodes = getNodesAtLevel(nodes, level);
        const upperNodes = getNodesAtLevel(nodes, level + 1);
        
        upperNodes.forEach(upper => {
          currentNodes.forEach(lower => {
            const dist = Math.abs(lower.index - upper.index * (NODES_PER_LEVEL[level] / NODES_PER_LEVEL[level + 1]));
            const weight = Math.exp(-dist * dist / 4);
            
            if (weight > 0.1) {
              // Prediction line (top-down, yellow)
              if (showPredictions) {
                ctx.strokeStyle = `rgba(250, 204, 21, ${weight * 0.3})`;
                ctx.lineWidth = weight * 2;
                ctx.beginPath();
                ctx.moveTo(upper.x, upper.y + 10);
                ctx.lineTo(lower.x, lower.y - 10);
                ctx.stroke();
              }
              
              // Error line (bottom-up, red, based on actual error)
              if (showErrors) {
                const errorMag = Math.abs(lower.error);
                ctx.strokeStyle = `rgba(239, 68, 68, ${errorMag * weight})`;
                ctx.lineWidth = errorMag * weight * 4;
                ctx.beginPath();
                ctx.moveTo(lower.x + 3, lower.y - 10);
                ctx.lineTo(upper.x + 3, upper.y + 10);
                ctx.stroke();
              }
            }
          });
        });
      }
      
      // Draw nodes
      nodes.forEach(node => {
        // Node glow based on activity
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
        const intensity = node.activity;
        gradient.addColorStop(0, `rgba(45, 212, 191, ${intensity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        ctx.fillStyle = `rgba(45, 212, 191, ${0.3 + intensity * 0.7})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8 + intensity * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Error indicator (red ring if large error)
        if (showErrors && Math.abs(node.error) > 0.1) {
          ctx.strokeStyle = `rgba(239, 68, 68, ${Math.abs(node.error)})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 12 + intensity * 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, inputType, showErrors, showPredictions]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Legend - Collapsible */}
      <CollapsiblePanel title="SIGNAL FLOW" position="bottom-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-0.5 bg-yellow-400" />
          <span className="text-text">Predictions (↓)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-red-400" />
          <span className="text-text">Errors (↑)</span>
        </div>
      </CollapsiblePanel>
      
      {/* Controls - Collapsible */}
      <CollapsibleControlPanel title="INPUT TYPE" position="top-right" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {['sine', 'step', 'random'].map(type => (
              <button
                key={type}
                onClick={() => setInputType(type)}
                className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-1 text-xs'} border rounded font-mono transition-colors ${
                  inputType === type
                    ? 'bg-glow/20 border-glow text-glow'
                    : 'bg-surface border-border text-muted hover:text-text'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPredictions(!showPredictions)}
              className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-2 py-1 text-xs'} border rounded font-mono transition-colors ${
                showPredictions ? 'border-yellow-400 text-yellow-400' : 'border-border text-muted'
              }`}
            >
              Pred
            </button>
            <button
              onClick={() => setShowErrors(!showErrors)}
              className={`${isMobile || isFullscreen ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-2 py-1 text-xs'} border rounded font-mono transition-colors ${
                showErrors ? 'border-red-400 text-red-400' : 'border-border text-muted'
              }`}
            >
              Error
            </button>
          </div>
        </div>
      </CollapsibleControlPanel>
      
      {/* Info - Collapsible */}
      <CollapsiblePanel title="ε_i = x_i - g_i(μ_{'{i+1}'})" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          Each level predicts the level below. Prediction errors propagate up, 
          updating higher-level beliefs until errors are minimized.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
