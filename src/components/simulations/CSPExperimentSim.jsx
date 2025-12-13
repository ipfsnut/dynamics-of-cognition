import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * CSPExperimentSim - Constraint Satisfaction as H(ω) Demonstration
 * 
 * This simulation demonstrates the core H(ω) claim using a constraint satisfaction
 * problem (CSP) solver with limited working memory.
 * 
 * Key insight: The solver returns VALID SOLUTION or FAILURE - never a wrong answer.
 * This is categorical accessibility, not continuous degradation.
 * 
 * Mapping to H(ω):
 * - Working memory capacity = configuration ω (specifically E_eff)
 * - Problem type = operation h (4-Queens, 6-Queens, etc.)
 * - Minimum memory to solve = initiation set boundary ∂I_h
 * - SOLVED = h ∈ H(ω) — operation accessible
 * - FAILURE = h ∉ H(ω) — categorical failure
 */

// Problem definitions
const PROBLEMS = {
  simple3: { name: 'Simple (3)', nVars: 3, type: 'simple', minCapacity: 3, description: 'No constraints' },
  simple5: { name: 'Simple (5)', nVars: 5, type: 'simple', minCapacity: 5, description: 'No constraints' },
  chain4: { name: 'Chain (4)', nVars: 4, type: 'chain', minCapacity: 4, description: 'x₀ < x₁ < x₂ < x₃' },
  queens4: { name: '4-Queens', nVars: 4, type: 'queens', minCapacity: 4, description: 'Non-attacking queens' },
  queens5: { name: '5-Queens', nVars: 5, type: 'queens', minCapacity: 5, description: 'Non-attacking queens' },
  queens6: { name: '6-Queens', nVars: 6, type: 'queens', minCapacity: 6, description: 'Non-attacking queens' },
  queens7: { name: '7-Queens', nVars: 7, type: 'queens', minCapacity: 7, description: 'Non-attacking queens' },
};

// Solver result types
const RESULT_TYPES = {
  success: { label: 'Solved', color: '#4ade80', emoji: '✓' },
  memory_exceeded: { label: 'Memory Exceeded', color: '#f87171', emoji: '✗' },
  budget_exhausted: { label: 'Budget Exhausted', color: '#facc15', emoji: '⏱' },
  pending: { label: 'Ready', color: '#71717a', emoji: '○' },
};

// Simple CSP solver with explicit memory limits
function solveCSP(problem, capacity, budget = 10000) {
  const n = problem.nVars;
  
  // Check if problem fits in memory at all
  if (n > capacity) {
    return { result: 'memory_exceeded', solution: null, opsUsed: 0, memoryUsed: n };
  }
  
  let opsCount = 0;
  let maxMemory = 0;
  
  // For queens, we need to find valid placement
  if (problem.type === 'queens') {
    const isValid = (positions, row, col) => {
      for (let i = 0; i < row; i++) {
        if (positions[i] === col) return false;
        if (Math.abs(positions[i] - col) === Math.abs(i - row)) return false;
      }
      return true;
    };
    
    const solve = (positions, row) => {
      opsCount++;
      maxMemory = Math.max(maxMemory, positions.length);
      
      if (opsCount > budget) return null;
      if (row === n) return positions;
      
      for (let col = 0; col < n; col++) {
        opsCount++;
        if (opsCount > budget) return null;
        
        if (isValid(positions, row, col)) {
          const result = solve([...positions, col], row + 1);
          if (result) return result;
        }
      }
      return null;
    };
    
    const solution = solve([], 0);
    if (opsCount > budget) {
      return { result: 'budget_exhausted', solution: null, opsUsed: opsCount, memoryUsed: maxMemory };
    }
    return { 
      result: solution ? 'success' : 'memory_exceeded', 
      solution, 
      opsUsed: opsCount, 
      memoryUsed: maxMemory 
    };
  }
  
  // Simple assignment - always succeeds if capacity sufficient
  if (problem.type === 'simple') {
    return { 
      result: 'success', 
      solution: Array(n).fill(0), 
      opsUsed: n, 
      memoryUsed: n 
    };
  }
  
  // Chain constraint
  if (problem.type === 'chain') {
    return { 
      result: 'success', 
      solution: Array(n).fill(0).map((_, i) => i), 
      opsUsed: n * 2, 
      memoryUsed: n 
    };
  }
  
  return { result: 'memory_exceeded', solution: null, opsUsed: 0, memoryUsed: 0 };
}

export function CSPExperimentSim({ isFullscreen = false }) {
  const canvasRef = useRef(null);
  const [selectedProblem, setSelectedProblem] = useState('queens5');
  const [capacity, setCapacity] = useState(6);
  const [result, setResult] = useState({ result: 'pending' });
  const [sweepResults, setSweepResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const problem = PROBLEMS[selectedProblem];
  
  // Run solver
  const runSolver = useCallback(() => {
    setIsRunning(true);
    setSweepResults([]);
    setTimeout(() => {
      const res = solveCSP(problem, capacity);
      setResult(res);
      setIsRunning(false);
    }, 50);
  }, [problem, capacity]);
  
  // Run capacity sweep to find threshold
  const runSweep = useCallback(() => {
    setIsRunning(true);
    setResult({ result: 'pending' });
    setTimeout(() => {
      const results = [];
      for (let cap = 1; cap <= 10; cap++) {
        const res = solveCSP(problem, cap);
        results.push({ cap, result: res.result });
      }
      setSweepResults(results);
      setIsRunning(false);
    }, 50);
  }, [problem]);
  
  // Draw visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);
    
    // Draw configuration space representation
    const maxRadius = Math.min(width, height) * 0.4;
    
    // Draw capacity rings
    for (let i = 1; i <= 10; i++) {
      const radius = (i / 10) * maxRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = i === capacity ? '#4ade80' : '#1f1f2e';
      ctx.lineWidth = i === capacity ? 2 : 1;
      ctx.stroke();
      
      // Label
      if (i % 2 === 0) {
        ctx.fillStyle = '#71717a';
        ctx.font = '10px monospace';
        ctx.fillText(`ω=${i}`, centerX + radius + 5, centerY);
      }
    }
    
    // Draw problem thresholds as initiation set boundaries
    Object.entries(PROBLEMS).forEach(([key, prob], index) => {
      const angle = (index / Object.keys(PROBLEMS).length) * Math.PI * 2 - Math.PI / 2;
      const thresholdRadius = (prob.minCapacity / 10) * maxRadius;
      
      // Draw threshold arc
      const arcStart = angle - 0.15;
      const arcEnd = angle + 0.15;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, thresholdRadius, arcStart, arcEnd);
      ctx.strokeStyle = key === selectedProblem ? '#a78bfa' : '#3f3f5a';
      ctx.lineWidth = key === selectedProblem ? 3 : 1;
      ctx.stroke();
      
      // Label
      const labelRadius = maxRadius + 20;
      const labelX = centerX + Math.cos(angle) * labelRadius;
      const labelY = centerY + Math.sin(angle) * labelRadius;
      ctx.fillStyle = key === selectedProblem ? '#e4e4e7' : '#71717a';
      ctx.font = key === selectedProblem ? 'bold 11px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(prob.name, labelX, labelY);
    });
    
    // Draw current position
    const currentRadius = (capacity / 10) * maxRadius;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#4ade80';
    ctx.fill();
    
    // Draw result indicator
    const resultInfo = RESULT_TYPES[result.result];
    ctx.fillStyle = resultInfo.color;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(resultInfo.emoji, centerX, centerY + 80);
    ctx.font = '12px sans-serif';
    ctx.fillText(resultInfo.label, centerX, centerY + 100);
    
    // Draw sweep results if available
    if (sweepResults.length > 0) {
      sweepResults.forEach((sr, i) => {
        const x = 50 + i * 35;
        const y = height - 40;
        const resInfo = RESULT_TYPES[sr.result];
        
        ctx.fillStyle = resInfo.color;
        ctx.font = '16px sans-serif';
        ctx.fillText(resInfo.emoji, x, y);
        ctx.fillStyle = '#71717a';
        ctx.font = '9px monospace';
        ctx.fillText(`ω=${sr.cap}`, x, y + 15);
      });
      
      // Find threshold
      const threshold = sweepResults.find(r => r.result === 'success')?.cap;
      if (threshold) {
        ctx.fillStyle = '#4ade80';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`I_h boundary: ω ≥ ${threshold}`, 50, height - 60);
      }
    }
    
    // Draw Queens board if solved
    if (result.result === 'success' && result.solution && problem.type === 'queens') {
      const n = result.solution.length;
      const cellSize = Math.min(30, 150 / n);
      const boardX = width - 180;
      const boardY = 50;
      
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          const x = boardX + col * cellSize;
          const y = boardY + row * cellSize;
          ctx.fillStyle = (row + col) % 2 === 0 ? '#1f1f2e' : '#2a2a3e';
          ctx.fillRect(x, y, cellSize, cellSize);
          
          if (result.solution[row] === col) {
            ctx.fillStyle = '#4ade80';
            ctx.font = `${cellSize * 0.7}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('♛', x + cellSize / 2, y + cellSize * 0.75);
          }
        }
      }
    }
    
  }, [capacity, selectedProblem, result, sweepResults, problem]);
  
  return (
    <div className="relative w-full h-full bg-void">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-full"
      />
      
      {/* Info panel */}
      <CollapsiblePanel 
        title="H(ω) ↔ CSP Mapping" 
        position="top-left"
        isFullscreen={isFullscreen}
        width="max-w-sm"
      >
        <div className="text-muted space-y-1">
          <div><span className="text-glow">ω</span> = working memory capacity</div>
          <div><span className="text-glow">h</span> = problem (operation)</div>
          <div><span className="text-glow">I_h</span> = configs where h solvable</div>
          <div className="pt-1 border-t border-white/10">
            <span className="text-emerald-400">✓</span> h ∈ H(ω) — accessible
          </div>
          <div>
            <span className="text-red-400">✗</span> h ∉ H(ω) — categorical failure
          </div>
        </div>
      </CollapsiblePanel>
      
      {/* Controls */}
      <CollapsibleControlPanel 
        title="Configuration ω" 
        position="bottom-left"
        isFullscreen={isFullscreen}
        panelWidth="w-72"
      >
        <div className="space-y-4">
          {/* Problem selector */}
          <div>
            <div className="text-xs text-muted mb-2">Select Operation h</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(PROBLEMS).map(([key, prob]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedProblem(key);
                    setResult({ result: 'pending' });
                    setSweepResults([]);
                  }}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedProblem === key
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-white/5 text-muted hover:bg-white/10'
                  }`}
                >
                  {prob.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Capacity slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Memory Capacity</span>
              <span className="text-glow font-mono">ω = {capacity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={capacity}
              onChange={(e) => {
                setCapacity(Number(e.target.value));
                setResult({ result: 'pending' });
                setSweepResults([]);
              }}
              className="w-full accent-emerald-500"
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={runSolver}
              disabled={isRunning}
              className="flex-1 px-3 py-2 text-xs font-medium rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-50"
            >
              {isRunning ? 'Running...' : 'h ∈ H(ω)?'}
            </button>
            <button
              onClick={runSweep}
              disabled={isRunning}
              className="flex-1 px-3 py-2 text-xs font-medium rounded bg-white/5 text-muted border border-white/10 hover:bg-white/10 disabled:opacity-50"
            >
              Find I_h
            </button>
          </div>
          
          {/* Result */}
          {result.result !== 'pending' && (
            <div className={`p-2 rounded text-xs ${
              result.result === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <div className="font-medium" style={{ color: RESULT_TYPES[result.result].color }}>
                {RESULT_TYPES[result.result].emoji} {RESULT_TYPES[result.result].label}
              </div>
              {result.opsUsed !== undefined && (
                <div className="text-muted mt-1">
                  {result.opsUsed} ops, {result.memoryUsed} memory
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleControlPanel>
      
      {/* Key insight */}
      <CollapsiblePanel 
        title="Key Insight" 
        position="top-right"
        isFullscreen={isFullscreen}
        defaultOpen={false}
      >
        <div className="text-muted text-xs space-y-2">
          <p>
            The solver cannot <strong className="text-text">hallucinate</strong>. When memory is 
            insufficient, it returns <span className="text-red-400">FAILURE</span>, not a wrong answer.
          </p>
          <p>
            This is <span className="text-glow">categorical accessibility</span>: the operation 
            either runs or it doesn't. No "degraded solution."
          </p>
        </div>
      </CollapsiblePanel>
    </div>
  );
}

export default CSPExperimentSim;
