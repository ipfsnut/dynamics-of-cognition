import { lazy, Suspense, Component } from 'react';
import { SimulationCanvas } from './SimulationCanvas';

/**
 * Helper to handle both named and default exports from simulation modules
 */
function resolveExport(mod, name) {
  // Try named export first (e.g., MarkovBlanketSim)
  if (mod[name]) return mod[name];
  // Try default export
  if (mod.default) return mod.default;
  // Try any exported component
  const keys = Object.keys(mod).filter(k => typeof mod[k] === 'function');
  if (keys.length > 0) return mod[keys[0]];
  throw new Error(`No valid export found in module for ${name}`);
}

/**
 * Lazy-load all simulation components
 * This keeps the bundle size manageable and only loads what's needed
 */
const simulations = {
  'markov-blanket': lazy(() => 
    import('./simulations/MarkovBlanketSim')
      .then(m => ({ default: resolveExport(m, 'MarkovBlanketSim') }))
      .catch(e => { console.error('Failed to load MarkovBlanketSim:', e); throw e; })
  ),
  'free-energy': lazy(() => 
    import('./simulations/FreeEnergySim')
      .then(m => ({ default: resolveExport(m, 'FreeEnergySim') }))
      .catch(e => { console.error('Failed to load FreeEnergySim:', e); throw e; })
  ),
  'morphogenesis': lazy(() => 
    import('./simulations/MorphogenesisSim')
      .then(m => ({ default: resolveExport(m, 'MorphogenesisSim') }))
      .catch(e => { console.error('Failed to load MorphogenesisSim:', e); throw e; })
  ),
  'homeostatic': lazy(() => 
    import('./simulations/HomeostaticSim')
      .then(m => ({ default: resolveExport(m, 'HomeostaticSim') }))
      .catch(e => { console.error('Failed to load HomeostaticSim:', e); throw e; })
  ),
  'interoceptive-pathway': lazy(() => 
    import('./simulations/InteroceptivePathwaySim')
      .then(m => ({ default: resolveExport(m, 'InteroceptivePathwaySim') }))
      .catch(e => { console.error('Failed to load InteroceptivePathwaySim:', e); throw e; })
  ),
  'autopoiesis': lazy(() => 
    import('./simulations/AutopoiesisSim')
      .then(m => ({ default: resolveExport(m, 'AutopoiesisSim') }))
      .catch(e => { console.error('Failed to load AutopoiesisSim:', e); throw e; })
  ),
  'language-controller': lazy(() => 
    import('./simulations/LanguageControllerSim')
      .then(m => ({ default: resolveExport(m, 'LanguageControllerSim') }))
      .catch(e => { console.error('Failed to load LanguageControllerSim:', e); throw e; })
  ),
  'controllosphere': lazy(() => 
    import('./simulations/ControllosphereSim')
      .then(m => ({ default: resolveExport(m, 'ControllosphereSim') }))
      .catch(e => { console.error('Failed to load ControllosphereSim:', e); throw e; })
  ),
  'annealing': lazy(() => 
    import('./simulations/AnnealingSim')
      .then(m => ({ default: resolveExport(m, 'AnnealingSim') }))
      .catch(e => { console.error('Failed to load AnnealingSim:', e); throw e; })
  ),
  'predictive-coding': lazy(() => 
    import('./simulations/PredictiveCodingSim')
      .then(m => ({ default: resolveExport(m, 'PredictiveCodingSim') }))
      .catch(e => { console.error('Failed to load PredictiveCodingSim:', e); throw e; })
  ),
  'nested-blankets': lazy(() => 
    import('./simulations/NestedBlanketsSim')
      .then(m => ({ default: resolveExport(m, 'NestedBlanketsSim') }))
      .catch(e => { console.error('Failed to load NestedBlanketsSim:', e); throw e; })
  ),
  'meta-modeling': lazy(() => 
    import('./simulations/MetaModelingSim')
      .then(m => ({ default: resolveExport(m, 'MetaModelingSim') }))
      .catch(e => { console.error('Failed to load MetaModelingSim:', e); throw e; })
  ),
};

/**
 * Metadata for simulations - titles and descriptions
 */
const simulationMeta = {
  'markov-blanket': {
    title: 'Markov Blanket Dynamics',
    description: 'Physical membrane separating internal from external states. Drag particles to see the statistical boundary in action.'
  },
  'free-energy': {
    title: 'Free Energy Landscape',
    description: 'Click anywhere to place a system—watch it minimize free energy by descending to attractor basins.'
  },
  'morphogenesis': {
    title: 'Bioelectric Morphogenesis',
    description: 'Draw damage on the tissue to see goal-directed regeneration in action.'
  },
  'homeostatic': {
    title: 'Homeostatic Feelings',
    description: 'Watch how bodily prediction errors become feelings as the system maintains homeostasis.'
  },
  'interoceptive-pathway': {
    title: 'Interoceptive Pathway',
    description: 'Signals flow from body through integration layers to the unified "now" — your global emotional moment.'
  },
  'autopoiesis': {
    title: 'Autopoietic System',
    description: 'Watch circular causality maintain the living boundary as the system self-produces.'
  },
  'language-controller': {
    title: 'Open-Loop vs Closed-Loop Control',
    description: 'Compare what Fedorenko measures vs what real communication requires.'
  },
  'controllosphere': {
    title: 'Controllosphere Dynamics',
    description: 'Adjust DLPFC signal to push neural state into the controllosphere. Watch metabolic costs and waste accumulation.'
  },
  'annealing': {
    title: 'Configuration Constraint: Annealing Dynamics',
    description: 'Adjust temperature to see how configurations become accessible or trapped. Click to relocate.'
  },
  'predictive-coding': {
    title: 'Predictive Coding',
    description: 'Hierarchical prediction error minimization in action.'
  },
  'nested-blankets': {
    title: 'Nested Markov Blankets',
    description: 'Explore the same mathematical structure repeating at every scale of organization.'
  },
  'meta-modeling': {
    title: 'Recursive Meta-Modeling',
    description: 'Click agents to explore nested models of models—the recursive structure of self-awareness.'
  },
};

/**
 * Loading fallback for lazy-loaded simulations
 */
function SimulationLoader() {
  return (
    <div className="flex items-center justify-center h-64 bg-deep rounded-lg border border-border">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-glow border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-sm text-muted">Loading simulation...</p>
      </div>
    </div>
  );
}

/**
 * Error boundary for simulations that fail to load
 */
function SimulationError({ simId, error }) {
  return (
    <div className="flex items-center justify-center h-64 bg-deep rounded-lg border border-red-500/30">
      <div className="text-center px-4">
        <p className="text-red-400 font-mono text-sm">ERROR</p>
        <p className="text-muted text-sm mt-1">Failed to load: {simId}</p>
        {error && <p className="text-muted text-xs mt-2 max-w-md">{error.message}</p>}
      </div>
    </div>
  );
}

/**
 * Error boundary class component for catching render errors
 */
class SimulationErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Simulation render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <SimulationError simId={this.props.simId} error={this.state.error} />;
    }
    return this.props.children;
  }
}

/**
 * Render a single simulation
 */
function RenderSimulation({ simId }) {
  const SimComponent = simulations[simId];
  const meta = simulationMeta[simId] || { 
    title: simId, 
    description: 'Interactive demonstration' 
  };

  if (!SimComponent) {
    return <SimulationError simId={simId} error={{ message: 'Simulation not found in registry' }} />;
  }

  return (
    <SimulationErrorBoundary simId={simId}>
      <SimulationCanvas title={meta.title} description={meta.description}>
        {({ width, height }) => (
          <Suspense fallback={<SimulationLoader />}>
            <SimComponent width={width} height={height} />
          </Suspense>
        )}
      </SimulationCanvas>
    </SimulationErrorBoundary>
  );
}

/**
 * SectionSimulations - Renders all simulations for a given section
 * 
 * @param {Object} section - Section object from sections.js
 * @param {string} section.simulation - Primary simulation ID
 * @param {string[]} section.additionalSims - Additional simulation IDs
 */
export function SectionSimulations({ section }) {
  if (!section) return null;

  const { simulation, additionalSims = [] } = section;
  
  // No simulations for this section
  if (!simulation && additionalSims.length === 0) {
    return null;
  }

  // Collect all simulation IDs
  const allSims = simulation 
    ? [simulation, ...additionalSims] 
    : additionalSims;

  return (
    <div className="space-y-8 my-8">
      {allSims.map((simId) => (
        <RenderSimulation key={simId} simId={simId} />
      ))}
    </div>
  );
}

export default SectionSimulations;