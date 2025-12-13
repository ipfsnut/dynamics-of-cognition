import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel } from './CollapsiblePanel';

/**
 * MorphogenesisSim - Bioelectric pattern formation and regeneration
 * 
 * Shows:
 * - A grid of cells with bioelectric potential (voltage)
 * - Cells communicate via gap junctions, sharing voltage
 * - A "target pattern" acts as an attractor in morphospace
 * - Damage/perturbation triggers regeneration toward the target
 * - Healing propagates from outside-in (edge cells heal first)
 * 
 * Key insight: Cells collectively compute toward a goal state
 * encoded in bioelectric patterns, not just genetic programs.
 * Damaged cells can only learn the pattern from healthy neighbors.
 */

const CELL_SIZE = 8;

// Target patterns - what the tissue "wants" to become
const PATTERNS = {
  circle: (x, y, cols, rows) => {
    const cx = cols / 2;
    const cy = rows / 2;
    const r = Math.min(cols, rows) * 0.35;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    return dist < r ? 0.8 : 0.2;
  },
  gradient: (x, y, cols, rows) => {
    return 0.2 + 0.6 * (x / cols);
  },
  stripes: (x, y, cols, rows) => {
    return Math.sin(x / cols * Math.PI * 4) > 0 ? 0.8 : 0.2;
  },
  spots: (x, y, cols, rows) => {
    const freq = 6;
    const val = Math.sin(x / cols * Math.PI * freq) * Math.sin(y / rows * Math.PI * freq);
    return val > 0 ? 0.8 : 0.2;
  },
};

function initializeGrid(cols, rows, pattern = 'circle') {
  const grid = [];
  const target = [];
  const patternFn = PATTERNS[pattern];
  
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    target[y] = [];
    for (let x = 0; x < cols; x++) {
      // Start with noise
      grid[y][x] = 0.5 + (Math.random() - 0.5) * 0.3;
      // Target pattern
      target[y][x] = patternFn(x, y, cols, rows);
    }
  }
  
  return { grid, target };
}

// Check if a cell has any healthy (non-damaged) neighbors
// Returns null if no healthy neighbors or if inputs are invalid
function getHealthyNeighborInfo(x, y, cols, rows, grid, target, damaged) {
  // Safety check for null/undefined inputs
  if (!grid || !target) return null;
  
  let healthyTargetSum = 0;
  let healthyVoltageSum = 0;
  let healthyCount = 0;
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        // Safety check for row existence
        if (!grid[ny] || !target[ny]) continue;
        
        // A neighbor is "healthy" if it's not damaged
        if (!damaged[ny]?.[nx]) {
          healthyTargetSum += target[ny][nx];
          healthyVoltageSum += grid[ny][nx];
          healthyCount++;
        }
      }
    }
  }
  
  if (healthyCount > 0) {
    return {
      targetAvg: healthyTargetSum / healthyCount,
      voltageAvg: healthyVoltageSum / healthyCount,
      count: healthyCount
    };
  }
  return null;
}

function updateGrid(grid, target, cols, rows, damaged, gapJunctionStrength, targetAttraction, noise) {
  const newGrid = [];
  const cellsToHeal = []; // Track cells that should be marked as healed
  
  for (let y = 0; y < rows; y++) {
    newGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      let voltage = grid[y][x];
      
      // Gap junction diffusion - average with neighbors (all neighbors, damaged or not)
      let neighborSum = 0;
      let neighborCount = 0;
      
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            neighborSum += grid[ny][nx];
            neighborCount++;
          }
        }
      }
      
      if (neighborCount > 0) {
        const neighborAvg = neighborSum / neighborCount;
        voltage += (neighborAvg - voltage) * gapJunctionStrength;
      }
      
      // Attraction toward target pattern
      const isDamaged = damaged[y]?.[x];
      
      if (isDamaged) {
        // Damaged cells can ONLY learn from healthy neighbors
        // They've lost their direct connection to the bioelectric "memory"
        const healthyInfo = getHealthyNeighborInfo(x, y, cols, rows, grid, target, damaged);
        
        if (healthyInfo && healthyInfo.count >= 2) {
          // Learn target from healthy neighbors (they "teach" the pattern)
          // Much slower than healthy cells — damaged tissue heals gradually
          voltage += (healthyInfo.targetAvg - voltage) * targetAttraction * 0.15;
          
          // If we're close enough to the healthy neighbor's target, we're healed
          // Tight threshold — must really match before graduating
          const errorFromTarget = Math.abs(voltage - healthyInfo.targetAvg);
          if (errorFromTarget < 0.05) {
            cellsToHeal.push({ x, y });
          }
        }
        // If no healthy neighbors, cell stays damaged and just diffuses
      } else {
        // Healthy cells know the target directly
        voltage += (target[y][x] - voltage) * targetAttraction;
      }
      
      // Small noise for dynamics
      voltage += (Math.random() - 0.5) * noise;
      
      // Clamp
      newGrid[y][x] = Math.max(0, Math.min(1, voltage));
    }
  }
  
  return { newGrid, cellsToHeal };
}

function computePatternError(grid, target, cols, rows) {
  let totalError = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      totalError += Math.abs(grid[y][x] - target[y][x]);
    }
  }
  return totalError / (cols * rows);
}

export function MorphogenesisSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const gridRef = useRef(null);
  const targetRef = useRef(null);
  const damagedRef = useRef({});
  const animationRef = useRef(null);
  const [pattern, setPattern] = useState('circle');
  const [showTarget, setShowTarget] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('damage'); // 'damage' or 'heal'
  const [error, setError] = useState(0);
  const [showParams, setShowParams] = useState(false);
  const [damageCount, setDamageCount] = useState(0);
  
  // Interactive parameters - slower defaults for visible wave propagation
  const [gapJunctionStrength, setGapJunctionStrength] = useState(0.12);
  const [targetAttraction, setTargetAttraction] = useState(0.08);
  const [noise, setNoise] = useState(0.003);
  
  const cols = Math.floor(width / CELL_SIZE);
  const rows = Math.floor(height / CELL_SIZE);
  
  // Initialize
  useEffect(() => {
    const { grid, target } = initializeGrid(cols, rows, pattern);
    gridRef.current = grid;
    targetRef.current = target;
    damagedRef.current = {};
  }, [cols, rows, pattern]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      const grid = gridRef.current;
      const target = targetRef.current;
      
      // Safety check - don't proceed if not initialized
      if (!grid || !target || !grid[0] || !target[0]) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Update grid
      const { newGrid, cellsToHeal } = updateGrid(
        grid, target, cols, rows, damagedRef.current, 
        gapJunctionStrength, targetAttraction, noise
      );
      gridRef.current = newGrid;
      
      // Heal cells that have recovered (propagation effect)
      // Limit healing to a few cells per frame for visible wave effect
      const maxHealPerFrame = 3;
      cellsToHeal.slice(0, maxHealPerFrame).forEach(({ x, y }) => {
        if (damagedRef.current[y]) {
          delete damagedRef.current[y][x];
        }
      });
      
      // Count damaged cells
      let dCount = 0;
      for (const row of Object.values(damagedRef.current)) {
        dCount += Object.keys(row).length;
      }
      setDamageCount(dCount);
      
      // Compute error
      const err = computePatternError(gridRef.current, target, cols, rows);
      setError(err);
      
      // Draw
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      const displayGrid = showTarget ? target : gridRef.current;
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const voltage = displayGrid[y]?.[x] ?? 0.5;
          const isDamaged = damagedRef.current[y]?.[x];
          
          // Check if this damaged cell has healthy neighbors (is on healing edge)
          // Only compute this if damaged to avoid unnecessary work
          let isHealingEdge = false;
          if (isDamaged && !showTarget && gridRef.current && targetRef.current) {
            const healthyInfo = getHealthyNeighborInfo(
              x, y, cols, rows, 
              gridRef.current, targetRef.current, damagedRef.current
            );
            isHealingEdge = healthyInfo && healthyInfo.count >= 2;
          }
          
          // Color based on voltage and damage state
          let r, g, b;
          if (isDamaged && !showTarget) {
            if (isHealingEdge) {
              // Healing edge cells - orange/yellow (actively receiving pattern)
              r = Math.floor(220 * voltage + 35);
              g = Math.floor(140 * voltage + 20);
              b = Math.floor(40 * voltage);
            } else {
              // Deep damaged cells - red (no healthy neighbors yet)
              r = Math.floor(200 * voltage + 55);
              g = Math.floor(50 * voltage);
              b = Math.floor(50 * voltage);
            }
          } else {
            // Normal cells in teal gradient
            r = Math.floor(45 * voltage);
            g = Math.floor(180 * voltage + 30);
            b = Math.floor(160 * voltage + 30);
          }
          
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
      
      // Draw grid lines (subtle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, height);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(width, y * CELL_SIZE);
        ctx.stroke();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, cols, rows, showTarget, gapJunctionStrength, targetAttraction, noise]);
  
  // Drawing handlers
  const applyTool = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    
    // Apply to a small radius
    const radius = 3;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          if (dx * dx + dy * dy <= radius * radius) {
            if (!damagedRef.current[ny]) damagedRef.current[ny] = {};
            
            if (tool === 'damage') {
              damagedRef.current[ny][nx] = true;
              // Aggressively scramble the voltage
              if (gridRef.current?.[ny]) {
                gridRef.current[ny][nx] = Math.random();
              }
            } else {
              delete damagedRef.current[ny][nx];
            }
          }
        }
      }
    }
  }, [cols, rows, tool]);
  
  const handleMouseDown = useCallback((e) => {
    setIsDrawing(true);
    applyTool(e);
  }, [applyTool]);
  
  const handleMouseMove = useCallback((e) => {
    if (isDrawing) {
      applyTool(e);
    }
  }, [isDrawing, applyTool]);
  
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);
  
  // Reset
  const handleReset = useCallback(() => {
    const { grid, target } = initializeGrid(cols, rows, pattern);
    gridRef.current = grid;
    targetRef.current = target;
    damagedRef.current = {};
  }, [cols, rows, pattern]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Error display - Collapsible */}
      <CollapsiblePanel title="PATTERN ERROR" position="bottom-left" defaultOpen={!isMobile} width="w-48" isFullscreen={isFullscreen}>
        <div className="flex items-end gap-2">
          <span className="font-mono text-2xl text-glow">
            {(error * 100).toFixed(1)}%
          </span>
          <span className="text-xs text-muted pb-1">
            {error < 0.1 ? '(converged)' : error > 0.3 ? '(regenerating)' : '(healing)'}
          </span>
        </div>
        <div className="mt-2 h-2 w-full bg-surface rounded overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-glow to-accent transition-all"
            style={{ width: `${(1 - error) * 100}%` }}
          />
        </div>
        {damageCount > 0 && (
          <div className="mt-2 text-xs text-red-400 font-mono">
            {damageCount} damaged cells
          </div>
        )}
      </CollapsiblePanel>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="flex gap-2">
          {Object.keys(PATTERNS).map(p => (
            <button
              key={p}
              onClick={() => setPattern(p)}
              className={`px-2 py-1 border rounded text-xs font-mono transition-colors ${
                pattern === p
                  ? 'bg-glow/20 border-glow text-glow'
                  : 'bg-surface border-border text-muted hover:text-text'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTool('damage')}
            className={`px-2 py-1 border rounded text-xs font-mono transition-colors ${
              tool === 'damage' ? 'border-red-400 text-red-400' : 'border-border text-muted'
            }`}
          >
            Damage
          </button>
          <button
            onClick={() => setTool('heal')}
            className={`px-2 py-1 border rounded text-xs font-mono transition-colors ${
              tool === 'heal' ? 'border-green-400 text-green-400' : 'border-border text-muted'
            }`}
          >
            Heal
          </button>
          <button
            onClick={() => setShowTarget(!showTarget)}
            className={`px-2 py-1 border rounded text-xs font-mono transition-colors ${
              showTarget ? 'bg-accent/20 border-accent text-accent' : 'border-border text-muted'
            }`}
          >
            Target
          </button>
          <button
            onClick={() => setShowParams(!showParams)}
            className={`px-2 py-1 border rounded text-xs font-mono transition-colors ${
              showParams ? 'bg-glow/20 border-glow text-glow' : 'border-border text-muted hover:text-text'
            }`}
          >
            Params
          </button>
          <button
            onClick={handleReset}
            className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono text-muted hover:text-text"
          >
            Reset
          </button>
        </div>
        
        {/* Parameters Panel */}
        {showParams && (
          <div className="bg-void/95 backdrop-blur-sm border border-border rounded-lg p-3 w-64">
            <div className="text-xs font-mono text-glow mb-3">Parameters</div>
            
            {/* Healing Speed */}
            <div className="mb-3">
              <div className="flex justify-between text-xs font-mono text-muted mb-1">
                <span>Healing Speed</span>
                <span>{(targetAttraction * 1000).toFixed(1)}‰</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.20"
                step="0.01"
                value={targetAttraction}
                onChange={(e) => setTargetAttraction(parseFloat(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-glow"
              />
              <div className="text-xs text-muted/60 mt-1">How fast edge cells learn from healthy neighbors</div>
            </div>
            
            {/* Electrical Coupling */}
            <div className="mb-3">
              <div className="flex justify-between text-xs font-mono text-muted mb-1">
                <span>Gap Junction</span>
                <span>{(gapJunctionStrength * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.01"
                value={gapJunctionStrength}
                onChange={(e) => setGapJunctionStrength(parseFloat(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="text-xs text-muted/60 mt-1">Electrical coupling — how fast voltage spreads</div>
            </div>
            
            {/* Noise */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-mono text-muted mb-1">
                <span>Noise</span>
                <span>{(noise * 1000).toFixed(1)}‰</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.015"
                step="0.001"
                value={noise}
                onChange={(e) => setNoise(parseFloat(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-text"
              />
              <div className="text-xs text-muted/60 mt-1">Random fluctuations in membrane potential</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Info - Collapsible */}
      <CollapsiblePanel title="Bioelectric Morphogenesis" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="text-muted">
          Cells share voltage via gap junctions and collectively compute toward 
          a target pattern. Damaged cells (red) have lost their "memory" — they 
          can only heal by learning from healthy neighbors (orange edge → teal).
          Watch the healing wave propagate inward.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
