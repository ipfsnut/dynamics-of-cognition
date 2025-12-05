import { useRef, useEffect, useState, useCallback } from 'react';
import { CollapsiblePanel, CollapsibleControlPanel } from './CollapsiblePanel';

/**
 * LanguageControllerSim - The Open-Loop Control Critique of Fedorenko
 * 
 * KEY INSIGHT: Fedorenko's paradigm DOES capture linguistic surprisal H(Z)_ling,
 * but it removes the COMMUNICATIVE FEEDBACK LOOP - there's no listener, no 
 * adaptation, no goal-achievement monitoring.
 * 
 * The controller isn't DEAD - it's running OPEN-LOOP.
 * 
 * Full model:
 * A = β₁L + β₂H(Z)_ling + β₃H(Z)_comm + β₄(L × H(Z)_comm)
 * 
 * Fedorenko measures: A = β₁L + β₂H(Z)_ling
 * What she misses: The communicative uncertainty terms
 */

// Example scenarios showing the distinction
const SCENARIOS = [
  {
    id: 'fedorenko_baseline',
    name: "Fedorenko's Paradigm",
    description: "Sentences vs nonwords in isolation",
    context: '"The doctor examined the patient carefully."',
    L: 0.4,           // Moderate linguistic complexity
    Hz_ling: 0.3,     // Some within-sentence surprisal (words have varying predictability)
    Hz_comm: 0,       // NO communicative uncertainty - no listener, no feedback
    feedback: false,
    explanation: "Standard localizer: captures L and H(Z)_ling, but H(Z)_comm = 0"
  },
  {
    id: 'fedorenko_surprising',
    name: "High Surprisal (Fedorenko)",
    description: "Surprising sentence, still isolated",
    context: '"Colorless green ideas sleep furiously."',
    L: 0.5,           // Moderate complexity
    Hz_ling: 0.9,     // HIGH linguistic surprisal - very unpredictable
    Hz_comm: 0,       // Still no communicative context
    feedback: false,
    explanation: "This WOULD activate more in Fedorenko's paradigm (high surprisal)"
  },
  {
    id: 'naturalistic_easy',
    name: "Easy Communication",
    description: "Simple message to familiar listener",
    context: 'Telling your roommate: "I\'m going to the store."',
    L: 0.2,           // Low complexity
    Hz_ling: 0.2,     // Low surprisal - predictable phrasing  
    Hz_comm: 0.15,    // Low comm uncertainty - they know you, context is clear
    feedback: true,
    explanation: "Closed-loop, but low uncertainty on all fronts"
  },
  {
    id: 'naturalistic_hard',
    name: "Complex Communication",
    description: "Technical explanation to novice",
    context: 'Explaining quantum entanglement to your grandmother',
    L: 0.8,           // High complexity
    Hz_ling: 0.6,     // Moderate surprisal
    Hz_comm: 0.85,    // HIGH comm uncertainty - Will she understand? How to adapt?
    feedback: true,
    explanation: "This is where Fedorenko's paradigm MISSES activation"
  },
  {
    id: 'repair',
    name: "Communication Repair",
    description: "Listener signals confusion, must reformulate",
    context: '"Wait, what do you mean?" → Rephrasing...',
    L: 0.5,           // Moderate complexity on reformulation
    Hz_ling: 0.4,     // Moderate surprisal
    Hz_comm: 0.95,    // VERY HIGH - active uncertainty reduction
    feedback: true,
    explanation: "Maximum controller engagement - closed-loop error correction"
  }
];

// Model coefficients (based on the theoretical framework)
const BETA = {
  L: 0.25,            // Linguistic complexity
  Hz_ling: 0.30,      // Linguistic uncertainty (what Fedorenko measures)
  Hz_comm: 0.25,      // Communicative uncertainty (what she misses)
  interaction: 0.20   // L × H(Z)_comm interaction
};

export function LanguageControllerSim({ width, height, isMobile = false, isFullscreen = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [mode, setMode] = useState('comparison'); // 'comparison', 'equation', 'feedback'
  const [selectedScenario, setSelectedScenario] = useState(0);
  const timeRef = useRef(0);
  
  const scenario = SCENARIOS[selectedScenario];
  
  // Calculate activation components
  const calculateActivation = useCallback((s) => {
    const L_term = BETA.L * s.L;
    const Hz_ling_term = BETA.Hz_ling * s.Hz_ling;
    const Hz_comm_term = BETA.Hz_comm * s.Hz_comm;
    const interaction_term = BETA.interaction * (s.L * s.Hz_comm);
    
    // What Fedorenko measures
    const fedorenko_sees = L_term + Hz_ling_term;
    
    // What she misses
    const fedorenko_misses = Hz_comm_term + interaction_term;
    
    // Full activation
    const total = fedorenko_sees + fedorenko_misses;
    
    return {
      L_term,
      Hz_ling_term,
      Hz_comm_term,
      interaction_term,
      fedorenko_sees,
      fedorenko_misses,
      total,
      // Raw values for display
      L: s.L,
      Hz_ling: s.Hz_ling,
      Hz_comm: s.Hz_comm
    };
  }, []);
  
  const activation = calculateActivation(scenario);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      
      ctx.fillStyle = '#111114';
      ctx.fillRect(0, 0, width, height);
      
      if (mode === 'comparison') {
        drawComparisonMode(ctx, t);
      } else if (mode === 'equation') {
        drawEquationMode(ctx, t);
      } else {
        drawFeedbackMode(ctx, t);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    const drawComparisonMode = (ctx, t) => {
      const centerX = width / 2;
      const barWidth = Math.min(200, width * 0.35);
      const barHeight = 25;
      const barX = centerX - barWidth / 2;
      
      // Title
      ctx.fillStyle = 'rgba(200, 200, 200, 0.95)';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Open-Loop vs Closed-Loop Control', centerX, 28);
      
      // Scenario name
      ctx.fillStyle = scenario.feedback ? 'rgba(100, 255, 150, 0.9)' : 'rgba(255, 180, 100, 0.9)';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(scenario.name, centerX, 52);
      
      // Description
      ctx.fillStyle = 'rgba(160, 160, 160, 0.8)';
      ctx.font = '11px monospace';
      ctx.fillText(scenario.description, centerX, 70);
      
      // Context quote - wrap if needed
      ctx.fillStyle = 'rgba(140, 180, 220, 0.85)';
      ctx.font = 'italic 11px monospace';
      const contextText = scenario.context;
      const maxWidth = width - 40;
      if (ctx.measureText(contextText).width > maxWidth) {
        ctx.font = 'italic 10px monospace';
      }
      ctx.fillText(contextText, centerX, 92);
      
      // Feedback loop indicator
      const loopY = 115;
      ctx.strokeStyle = scenario.feedback ? 'rgba(100, 255, 150, 0.6)' : 'rgba(255, 100, 100, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash(scenario.feedback ? [] : [5, 5]);
      
      // Draw loop symbol
      const loopRadius = 12;
      ctx.beginPath();
      ctx.arc(centerX - 50, loopY, loopRadius, 0.5, Math.PI * 1.5);
      ctx.stroke();
      
      // Arrow head
      if (scenario.feedback) {
        ctx.fillStyle = 'rgba(100, 255, 150, 0.8)';
        ctx.beginPath();
        ctx.moveTo(centerX - 50 + loopRadius - 3, loopY - 4);
        ctx.lineTo(centerX - 50 + loopRadius + 4, loopY);
        ctx.lineTo(centerX - 50 + loopRadius - 3, loopY + 4);
        ctx.fill();
      }
      
      ctx.setLineDash([]);
      ctx.fillStyle = scenario.feedback ? 'rgba(100, 255, 150, 0.9)' : 'rgba(255, 100, 100, 0.8)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(scenario.feedback ? 'CLOSED-LOOP' : 'OPEN-LOOP', centerX - 25, loopY + 4);
      ctx.textAlign = 'center';
      
      // Activation bars section
      const barsStartY = 145;
      
      // Section header
      ctx.fillStyle = 'rgba(180, 180, 180, 0.9)';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('Activation Components', centerX, barsStartY);
      
      // Draw each component bar
      const components = [
        { 
          label: 'L (Complexity)', 
          value: activation.L_term, 
          raw: activation.L,
          color: [150, 200, 255],
          fedorenko: true 
        },
        { 
          label: 'H(Z)_ling (Surprisal)', 
          value: activation.Hz_ling_term, 
          raw: activation.Hz_ling,
          color: [200, 180, 255],
          fedorenko: true 
        },
        { 
          label: 'H(Z)_comm (Listener)', 
          value: activation.Hz_comm_term, 
          raw: activation.Hz_comm,
          color: [255, 180, 100],
          fedorenko: false 
        },
        { 
          label: 'L × H(Z)_comm', 
          value: activation.interaction_term, 
          raw: activation.L * activation.Hz_comm,
          color: [255, 150, 150],
          fedorenko: false 
        }
      ];
      
      components.forEach((comp, i) => {
        const y = barsStartY + 25 + i * 38;
        
        // Label
        ctx.fillStyle = comp.fedorenko 
          ? `rgba(${comp.color.join(',')}, 0.9)` 
          : `rgba(${comp.color.join(',')}, 0.9)`;
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(comp.label, 15, y);
        
        // Fedorenko indicator
        ctx.font = '9px monospace';
        if (comp.fedorenko) {
          ctx.fillStyle = 'rgba(100, 200, 100, 0.7)';
          ctx.fillText('✓ measured', width - 70, y);
        } else {
          ctx.fillStyle = 'rgba(255, 150, 100, 0.7)';
          ctx.fillText('✗ missed', width - 60, y);
        }
        
        // Bar background
        ctx.fillStyle = 'rgba(40, 40, 50, 0.8)';
        ctx.fillRect(barX, y + 5, barWidth, barHeight);
        
        // Bar fill with animation
        const fillWidth = barWidth * comp.value * (1 + Math.sin(t * 2) * 0.02);
        const gradient = ctx.createLinearGradient(barX, 0, barX + fillWidth, 0);
        gradient.addColorStop(0, `rgba(${comp.color.join(',')}, 0.9)`);
        gradient.addColorStop(1, `rgba(${comp.color.join(',')}, 0.5)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, y + 5, Math.max(0, fillWidth), barHeight);
        
        // Border
        ctx.strokeStyle = comp.fedorenko 
          ? 'rgba(100, 200, 100, 0.5)' 
          : 'rgba(255, 150, 100, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, y + 5, barWidth, barHeight);
        
        // Value
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${(comp.value * 100).toFixed(0)}%`, barX + barWidth / 2, y + 22);
      });
      
      // Summary section
      const summaryY = barsStartY + 185;
      
      // Fedorenko sees
      ctx.fillStyle = 'rgba(100, 200, 100, 0.9)';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Fedorenko measures:', 15, summaryY);
      ctx.font = '14px monospace';
      ctx.fillText(`${(activation.fedorenko_sees * 100).toFixed(0)}%`, 150, summaryY);
      
      // What she misses
      ctx.fillStyle = 'rgba(255, 150, 100, 0.9)';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('What she misses:', 15, summaryY + 22);
      ctx.font = '14px monospace';
      ctx.fillText(`${(activation.fedorenko_misses * 100).toFixed(0)}%`, 150, summaryY + 22);
      
      // Total
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('TOTAL ACTIVATION:', 15, summaryY + 48);
      ctx.font = 'bold 18px monospace';
      const totalColor = activation.total > 0.5 ? 'rgba(100, 255, 150, 1)' : 'rgba(200, 200, 200, 0.9)';
      ctx.fillStyle = totalColor;
      ctx.fillText(`${(activation.total * 100).toFixed(0)}%`, 170, summaryY + 48);
      
      // Explanation
      ctx.fillStyle = 'rgba(140, 140, 140, 0.8)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      
      // Wrap explanation text
      const expWords = scenario.explanation.split(' ');
      let line = '';
      let lineY = summaryY + 75;
      expWords.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > width - 30) {
          ctx.fillText(line.trim(), centerX, lineY);
          line = word + ' ';
          lineY += 14;
        } else {
          line = testLine;
        }
      });
      if (line.trim()) ctx.fillText(line.trim(), centerX, lineY);
    };
    
    const drawEquationMode = (ctx, t) => {
      const centerX = width / 2;
      
      // Title
      ctx.fillStyle = 'rgba(200, 200, 200, 0.95)';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('The Complete Model', centerX, 35);
      
      // Full equation
      ctx.font = '13px monospace';
      ctx.fillStyle = 'rgba(100, 200, 255, 0.9)';
      ctx.fillText('A = β₁L + β₂H(Z)_ling + β₃H(Z)_comm + β₄(L×H(Z)_comm)', centerX, 70);
      
      // Variable explanations
      const vars = [
        { symbol: 'L', desc: 'Linguistic complexity (syntax, vocabulary)', color: [150, 200, 255] },
        { symbol: 'H(Z)_ling', desc: 'Linguistic uncertainty (word predictability)', color: [200, 180, 255] },
        { symbol: 'H(Z)_comm', desc: 'Communicative uncertainty (listener state)', color: [255, 180, 100] },
        { symbol: 'L × H(Z)_comm', desc: 'Interaction: complex language under listener uncertainty', color: [255, 150, 150] },
      ];
      
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      vars.forEach((v, i) => {
        const y = 105 + i * 32;
        ctx.fillStyle = `rgb(${v.color.join(',')})`;
        ctx.fillText(v.symbol, 20, y);
        ctx.fillStyle = 'rgba(180, 180, 180, 0.85)';
        ctx.fillText('= ' + v.desc, 110, y);
      });
      
      // The critique section
      const critiqueY = 240;
      ctx.fillStyle = 'rgba(255, 180, 100, 0.95)';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("Fedorenko's Open-Loop Problem", centerX, critiqueY);
      
      ctx.fillStyle = 'rgba(180, 180, 180, 0.85)';
      ctx.font = '11px monospace';
      const critiqueLines = [
        "Her paradigm measures:",
        "",
        "A_fedorenko = β₁L + β₂H(Z)_ling",
        "",
        "What she misses:",
        "",
        "β₃H(Z)_comm + β₄(L × H(Z)_comm)",
        "",
        "The communicative feedback loop is severed.",
        "The controller runs, but open-loop—",
        "with no target to control toward."
      ];
      
      critiqueLines.forEach((line, i) => {
        const y = critiqueY + 22 + i * 17;
        if (line.includes('A_fedorenko')) {
          ctx.fillStyle = 'rgba(100, 200, 100, 0.9)';
          ctx.font = '12px monospace';
        } else if (line.includes('β₃H')) {
          ctx.fillStyle = 'rgba(255, 150, 100, 0.9)';
          ctx.font = '12px monospace';
        } else {
          ctx.fillStyle = 'rgba(160, 160, 160, 0.8)';
          ctx.font = '11px monospace';
        }
        ctx.fillText(line, centerX, y);
      });
      
      // The punchline
      ctx.fillStyle = 'rgba(100, 255, 150, 0.95)';
      ctx.font = 'bold 11px monospace';
      const punchY = height - 55;
      ctx.fillText('"Fedorenko found a controller.', centerX, punchY);
      ctx.fillText("She just doesn't know it because", centerX, punchY + 16);
      ctx.fillText('she\'s never closed the loop."', centerX, punchY + 32);
    };
    
    const drawFeedbackMode = (ctx, t) => {
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Title
      ctx.fillStyle = 'rgba(200, 200, 200, 0.95)';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('The Control Loop', centerX, 30);
      
      // Draw control loop diagram
      const radius = Math.min(width, height) * 0.25;
      const boxWidth = 80;
      const boxHeight = 35;
      
      // Positions
      const speaker = { x: centerX - radius, y: centerY - 30 };
      const listener = { x: centerX + radius, y: centerY - 30 };
      const message = { x: centerX, y: centerY - radius - 20 };
      const feedback = { x: centerX, y: centerY + radius - 40 };
      
      // Draw boxes
      const drawBox = (pos, label, color, active) => {
        const glow = active ? 0.3 + Math.sin(t * 3) * 0.15 : 0;
        ctx.fillStyle = `rgba(${color}, ${0.15 + glow})`;
        ctx.strokeStyle = `rgba(${color}, ${0.7 + glow * 0.3})`;
        ctx.lineWidth = 2;
        ctx.fillRect(pos.x - boxWidth/2, pos.y - boxHeight/2, boxWidth, boxHeight);
        ctx.strokeRect(pos.x - boxWidth/2, pos.y - boxHeight/2, boxWidth, boxHeight);
        
        ctx.fillStyle = `rgba(${color}, 0.95)`;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, pos.x, pos.y + 4);
      };
      
      // Draw arrows
      const drawArrow = (from, to, label, active, curved = false) => {
        ctx.strokeStyle = active ? 'rgba(100, 255, 150, 0.8)' : 'rgba(100, 100, 100, 0.4)';
        ctx.fillStyle = active ? 'rgba(100, 255, 150, 0.8)' : 'rgba(100, 100, 100, 0.4)';
        ctx.lineWidth = active ? 2 : 1;
        ctx.setLineDash(active ? [] : [4, 4]);
        
        ctx.beginPath();
        if (curved) {
          const cp1x = from.x;
          const cp1y = (from.y + to.y) / 2 + 30;
          const cp2x = to.x;
          const cp2y = (from.y + to.y) / 2 + 30;
          ctx.moveTo(from.x, from.y + boxHeight/2);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y + boxHeight/2);
        } else {
          ctx.moveTo(from.x + boxWidth/2, from.y);
          ctx.lineTo(to.x - boxWidth/2, to.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Arrow head
        const angle = curved ? Math.PI/2 : Math.atan2(to.y - from.y, to.x - from.x);
        const headX = curved ? to.x : to.x - boxWidth/2;
        const headY = curved ? to.y + boxHeight/2 : to.y;
        
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(headX - 8 * Math.cos(angle - 0.3), headY - 8 * Math.sin(angle - 0.3));
        ctx.lineTo(headX - 8 * Math.cos(angle + 0.3), headY - 8 * Math.sin(angle + 0.3));
        ctx.closePath();
        ctx.fill();
        
        // Label
        if (label) {
          ctx.fillStyle = active ? 'rgba(200, 200, 200, 0.9)' : 'rgba(100, 100, 100, 0.6)';
          ctx.font = '9px monospace';
          const labelX = curved ? (from.x + to.x) / 2 : (from.x + to.x) / 2;
          const labelY = curved ? (from.y + to.y) / 2 + 50 : (from.y + to.y) / 2 - 8;
          ctx.fillText(label, labelX, labelY);
        }
      };
      
      const isClosed = scenario.feedback;
      
      // Draw the loop
      drawBox(speaker, 'SPEAKER', '100, 200, 255', true);
      drawBox(listener, 'LISTENER', '255, 180, 100', isClosed);
      drawBox(message, 'MESSAGE', '200, 180, 255', true);
      drawBox(feedback, 'FEEDBACK', '100, 255, 150', isClosed);
      
      // Arrows
      drawArrow(speaker, message, 'encode', true, false);
      drawArrow(message, listener, 'decode', true, false);
      drawArrow(listener, feedback, 'signal', isClosed, false);
      drawArrow(feedback, speaker, 'adapt', isClosed, true);
      
      // H(Z)_comm indicator
      const hzY = height - 90;
      ctx.fillStyle = 'rgba(255, 180, 100, 0.9)';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('H(Z)_comm = Uncertainty about listener state', centerX, hzY);
      
      ctx.fillStyle = 'rgba(160, 160, 160, 0.8)';
      ctx.font = '10px monospace';
      if (isClosed) {
        ctx.fillText('Closed loop: Controller actively reduces H(Z)_comm', centerX, hzY + 18);
        ctx.fillStyle = 'rgba(100, 255, 150, 0.8)';
        ctx.fillText(`H(Z)_comm = ${(scenario.Hz_comm * 100).toFixed(0)}% (being managed)`, centerX, hzY + 36);
      } else {
        ctx.fillText('Open loop: H(Z)_comm undefined (no listener to model)', centerX, hzY + 18);
        ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.fillText('H(Z)_comm = 0 (Fedorenko paradigm)', centerX, hzY + 36);
      }
      
      // Mode indicator
      ctx.fillStyle = isClosed ? 'rgba(100, 255, 150, 0.9)' : 'rgba(255, 150, 100, 0.9)';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(isClosed ? '● CLOSED-LOOP CONTROL' : '○ OPEN-LOOP (Fedorenko)', centerX, hzY + 58);
    };
    
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [width, height, mode, scenario, activation]);
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      
      {/* Mode Toggle - Collapsible */}
      <CollapsiblePanel title="View" position="top-left" defaultOpen={!isMobile} isFullscreen={isFullscreen}>
        <div className="flex gap-1">
          {[
            { id: 'comparison', label: 'Compare' },
            { id: 'equation', label: 'Theory' },
            { id: 'feedback', label: 'Loop' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-2 py-1 border rounded text-xs font-mono transition-colors ${
                mode === m.id
                  ? 'bg-glow/20 border-glow text-glow'
                  : 'bg-surface border-border text-muted hover:text-text'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </CollapsiblePanel>
      
      {/* Scenario selector - Collapsible */}
      <CollapsibleControlPanel title="Scenario" position="top-right" defaultOpen={!isMobile} panelWidth="w-48" isFullscreen={isFullscreen}>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(i)}
              className={`px-2 py-1 border rounded text-xs font-mono transition-colors text-left ${
                selectedScenario === i
                  ? s.feedback 
                    ? 'bg-green-500/20 border-green-400 text-green-400'
                    : 'bg-orange-500/20 border-orange-400 text-orange-400'
                  : 'bg-surface border-border text-muted hover:text-text'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </CollapsibleControlPanel>
      
      {/* Key insight - Collapsible */}
      <CollapsiblePanel title="Key Insight" position="bottom-left" defaultOpen={!isMobile} width="w-56" isFullscreen={isFullscreen}>
        <div className="text-xs text-muted leading-relaxed">
          Fedorenko <span className="text-green-400">measures</span> linguistic surprisal.<br/>
          She <span className="text-orange-400">misses</span> communicative uncertainty—<br/>
          the listener-modeling that real language requires.
        </div>
      </CollapsiblePanel>
    </div>
  );
}
