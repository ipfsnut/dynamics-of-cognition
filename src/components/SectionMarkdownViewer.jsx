import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { SimulationCanvas } from './SimulationCanvas';

// Import all simulations
import { MarkovBlanketSim } from './simulations/MarkovBlanketSim';
import { FreeEnergySim } from './simulations/FreeEnergySim';
import { MorphogenesisSim } from './simulations/MorphogenesisSim';
import { HomeostaticSim } from './simulations/HomeostaticSim';
import { InteroceptivePathwaySim } from './simulations/InteroceptivePathwaySim';
import { AutopoiesisSim } from './simulations/AutopoiesisSim';
import { LanguageControllerSim } from './simulations/LanguageControllerSim';
import { ControllosphereSim } from './simulations/ControllosphereSim';
import { AnnealingSim } from './simulations/AnnealingSim';
import { PredictiveCodingSim } from './simulations/PredictiveCodingSim';
import { NestedBlanketsSim } from './simulations/NestedBlanketsSim';
import { CognitiveHorizonSim } from './simulations/CognitiveHorizonSim';
import { ConfigurationAwarenessSim } from './simulations/ConfigurationAwarenessSim';
import { MetaModelingSim } from './simulations/MetaModelingSim';
import { AttractorSim } from './simulations/AttractorSim';
import { InterfaceDynamicsSim } from './simulations/InterfaceDynamicsSim';
import { EnergyAffordanceSim } from './simulations/EnergyAffordanceSim';
import { FatigueRecoverySim } from './simulations/FatigueRecoverySim';
import { CSPExperimentSim } from './simulations/CSPExperimentSim';

// Map simulation IDs to components and metadata
const SIMULATION_REGISTRY = {
  'markov-blanket': {
    component: MarkovBlanketSim,
    title: 'Markov Blanket',
    description: 'A system maintaining statistical separation from its environment through sensory and active states.'
  },
  'free-energy': {
    component: FreeEnergySim,
    title: 'Free Energy Minimization',
    description: 'Watch how a system minimizes variational free energy through perception and action.'
  },
  'morphogenesis': {
    component: MorphogenesisSim,
    title: 'Morphogenetic Computation',
    description: 'Bioelectric networks guide cells toward target morphology through collective inference.'
  },
  'homeostatic': {
    component: HomeostaticSim,
    title: 'Homeostatic Regulation',
    description: 'Feelings as sentinels of bodily state, driving regulatory action.'
  },
  'interoceptive-pathway': {
    component: InteroceptivePathwaySim,
    title: 'Interoceptive Pathway',
    description: 'How internal body signals shape perception and cognition.'
  },
  'autopoiesis': {
    component: AutopoiesisSim,
    title: 'Autopoietic Organization',
    description: 'Self-producing networks that maintain their own boundaries.'
  },
  'language-controller': {
    component: LanguageControllerSim,
    title: 'Language as Controller',
    description: 'Language networks minimizing communicative uncertainty.'
  },
  'controllosphere': {
    component: ControllosphereSim,
    title: 'The Controllosphere',
    description: 'Cognitive effort as metabolic expenditure beyond the intrinsic manifold.'
  },
  'annealing': {
    component: AnnealingSim,
    title: 'Configuration Annealing',
    description: 'The body annealing through configuration space, with cognitive accessibility as a function of state.'
  },
  'predictive-coding': {
    component: PredictiveCodingSim,
    title: 'Predictive Coding',
    description: 'Hierarchical prediction error minimization in action.'
  },
  'nested-blankets': {
    component: NestedBlanketsSim,
    title: 'Nested Markov Blankets',
    description: 'The same mathematical structure repeating at every scale of organization.'
  },
  'cognitive-horizon': {
    component: CognitiveHorizonSim,
    title: 'Cognitive Horizon',
    description: 'Your body configuration determines which thoughts are accessible. Change state to watch the horizon expand or contract.'
  },
  'configuration-awareness': {
    component: ConfigurationAwarenessSim,
    title: 'Configuration Awareness',
    description: 'Two agents try to reach the same goal. The aware agent can model its own H(ω) and strategically shift states.'
  },
  'meta-modeling': {
    component: MetaModelingSim,
    title: 'Meta-Modeling',
    description: 'When the model models itself—the emergence of self-awareness.'
  },
  'attractor': {
    component: AttractorSim,
    title: 'Attractor Dynamics',
    description: 'Cognitive states as attractors in a dynamical landscape.'
  },
  'interface-dynamics': {
    component: InterfaceDynamicsSim,
    title: 'Interface Dynamics',
    description: 'Feelings emerge at the boundaries where Markov blankets meet.'
  },
  'energy-affordance': {
    component: EnergyAffordanceSim,
    title: 'Energy & Affordances',
    description: 'How metabolic state shapes the cognitive affordance field.'
  },
  'fatigue-recovery': {
    component: FatigueRecoverySim,
    title: 'Fatigue & Recovery',
    description: 'H(ω) contraction under fatigue and expansion during recovery.'
  },
  'csp-experiment': {
    component: CSPExperimentSim,
    title: 'CSP Categorical Accessibility',
    description: 'Testing whether cognitive operations are categorically gated by configuration.'
  },
};

// Regex to match ::sim[simulation-id] or ::sim[simulation-id]{title="Custom Title" description="Custom desc"}
const SIM_MARKER_REGEX = /^::sim\[([^\]]+)\](?:\{([^}]*)\})?$/;

/**
 * Parse optional attributes from {key="value" key2="value2"} syntax
 */
function parseAttributes(attrString) {
  if (!attrString) return {};
  const attrs = {};
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

/**
 * Split markdown content into segments (text and simulation markers)
 */
function parseContent(content) {
  const lines = content.split('\n');
  const segments = [];
  let currentText = [];

  for (const line of lines) {
    const match = line.match(SIM_MARKER_REGEX);
    if (match) {
      // Push accumulated text as a segment
      if (currentText.length > 0) {
        segments.push({ type: 'markdown', content: currentText.join('\n') });
        currentText = [];
      }
      // Push simulation marker as a segment
      const [, simId, attrString] = match;
      const attrs = parseAttributes(attrString);
      segments.push({ type: 'simulation', id: simId, ...attrs });
    } else {
      currentText.push(line);
    }
  }

  // Push remaining text
  if (currentText.length > 0) {
    segments.push({ type: 'markdown', content: currentText.join('\n') });
  }

  return segments;
}

/**
 * Markdown component configuration (same as MarkdownViewer)
 */
const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="font-display text-3xl sm:text-4xl text-glow font-light leading-tight mb-6 mt-12 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-2xl sm:text-3xl text-text font-light leading-tight mb-4 mt-10">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-xl sm:text-2xl text-text/90 mb-3 mt-8">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-display text-lg text-text/80 mb-2 mt-6">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-text/80 leading-relaxed mb-4">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="text-text font-medium">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="text-text/90">
      {children}
    </em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-glow/30 pl-4 my-4 text-text/70 italic">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-5 mb-4 space-y-1 text-text/80">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-5 mb-4 space-y-1 text-text/80">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),
  hr: () => (
    <hr className="my-10 border-border" />
  ),
  a: ({ href, children }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-glow/80 hover:text-glow underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ inline, children }) => {
    if (inline) {
      return (
        <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded text-glow/90">
          {children}
        </code>
      );
    }
    return (
      <code className="block font-mono text-sm bg-surface p-4 rounded-lg overflow-x-auto my-4">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-surface rounded-lg overflow-x-auto my-4">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border/50">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-surface/30 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-medium text-text/90 bg-surface/50">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-text/70">
      {children}
    </td>
  ),
};

/**
 * Render a simulation component
 */
function SimulationBlock({ id, title: customTitle, description: customDescription }) {
  const simConfig = SIMULATION_REGISTRY[id];
  
  if (!simConfig) {
    return (
      <div className="my-8 p-4 border border-red-500/30 rounded-lg bg-red-500/5">
        <p className="text-red-400">Unknown simulation: {id}</p>
      </div>
    );
  }

  const { component: SimComponent, title, description } = simConfig;
  const displayTitle = customTitle || title;
  const displayDescription = customDescription || description;

  return (
    <SimulationCanvas title={displayTitle} description={displayDescription}>
      {({ width, height }) => (
        <SimComponent width={width} height={height} />
      )}
    </SimulationCanvas>
  );
}

/**
 * SectionMarkdownViewer - Renders markdown with embedded simulations
 * 
 * Use ::sim[simulation-id] markers in markdown to embed simulations.
 * Optional: ::sim[simulation-id]{title="Custom" description="Custom desc"}
 */
export function SectionMarkdownViewer({ content }) {
  const segments = useMemo(() => parseContent(content), [content]);

  return (
    <div className="section-content">
      {segments.map((segment, index) => {
        if (segment.type === 'simulation') {
          return (
            <SimulationBlock
              key={`sim-${index}`}
              id={segment.id}
              title={segment.title}
              description={segment.description}
            />
          );
        }
        return (
          <ReactMarkdown
            key={`md-${index}`}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {segment.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}

// Export the registry for reference
export { SIMULATION_REGISTRY };
