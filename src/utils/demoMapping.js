/**
 * Mapping between vault notes and interactive Explorer sections
 * Creates bidirectional links between theoretical content and hands-on demos
 */

// Map vault note IDs to Explorer section slugs and specific simulations
export const NOTE_TO_DEMO_MAP = {
  // Free Energy & Markov Blankets
  'concepts/free-energy': {
    section: 'free-energy',
    simulations: ['markov-blanket', 'free-energy'],
    description: 'Explore free energy minimization with interactive simulations'
  },
  'concepts/markov-blanket': {
    section: 'free-energy', 
    simulations: ['markov-blanket'],
    description: 'See how Markov blankets separate inside from outside'
  },
  'canonical/01-free-energy': {
    section: 'free-energy',
    simulations: ['markov-blanket', 'free-energy'],
    description: 'Interactive demonstrations of the free energy principle'
  },
  'canonical/07-nested-blankets': {
    section: 'nested-blankets',
    simulations: ['nested-blankets'],
    description: 'Visualize scale-free architecture from molecules to societies'
  },

  // Bioelectric & Morphogenesis  
  'canonical/02-bioelectric': {
    section: 'bioelectric-networks',
    simulations: ['morphogenesis'],
    description: 'Watch cellular intelligence scale into anatomical cognition'
  },
  'concepts/morphogenetic-computation': {
    section: 'bioelectric-networks',
    simulations: ['morphogenesis'],
    description: 'See goal-directed problem-solving in anatomical space'
  },

  // Homeostatic Regulation & Interoception
  'canonical/03-homeostatic': {
    section: 'homeostatic-feelings',
    simulations: ['homeostatic', 'interoceptive-pathway'],
    description: 'Experience the phenomenal substrate of consciousness'
  },
  'concepts/interoception': {
    section: 'homeostatic-feelings',
    simulations: ['interoceptive-pathway'],
    description: 'Explore the sense of the body\'s internal state'
  },
  'concepts/consciousness': {
    section: 'consciousness',
    simulations: ['meta-modeling'],
    description: 'Investigate what happens when the model models itself'
  },

  // Autopoiesis
  'canonical/04-autopoiesis': {
    section: 'autopoiesis',
    simulations: ['autopoiesis'],
    description: 'Explore self-producing organization as intelligence foundation'
  },
  'concepts/enactivism': {
    section: 'autopoiesis',
    simulations: ['autopoiesis'],
    description: 'See cognition as embodied action, not internal representation'
  },

  // Language Networks
  'canonical/05-language': {
    section: 'language-networks',
    simulations: ['language-controller'],
    description: 'Examine language as a controller running open-loop'
  },

  // Controllosphere & Configuration
  'canonical/06-controllosphere': {
    section: 'controllosphere',
    simulations: ['controllosphere'],
    description: 'Understand cognitive effort as neural energetics'
  },
  'concepts/controllosphere': {
    section: 'controllosphere',
    simulations: ['controllosphere'],
    description: 'Explore the neural architecture of cognitive effort'
  },
  'concepts/intrinsic-manifold': {
    section: 'controllosphere',
    simulations: ['controllosphere'],
    description: 'See the default dynamics the system returns to'
  },

  // Configuration Constraint & H(ω)
  'canonical/08-configuration': {
    section: 'configuration-constraint',
    simulations: ['annealing'],
    description: 'Experience cognition as whole-body annealing'
  },
  'concepts/h-omega': {
    section: 'configuration-constraint',
    simulations: ['annealing'],
    description: 'Explore what cannot be configured cannot be thought'
  },
  'concepts/affordance': {
    section: 'configuration-constraint',
    simulations: ['annealing'],
    description: 'See how the environment offers action possibilities'
  },

  // Empirical Predictions
  'evidence/predictions': {
    section: 'empirical-predictions',
    simulations: ['predictive-coding'],
    description: 'Test the configuration constraint hypothesis'
  }
};

// Reverse mapping: Explorer sections to relevant vault notes
export const DEMO_TO_NOTES_MAP = {
  'free-energy': [
    'concepts/free-energy',
    'concepts/markov-blanket', 
    'canonical/01-free-energy'
  ],
  'bioelectric-networks': [
    'canonical/02-bioelectric',
    'concepts/morphogenetic-computation'
  ],
  'homeostatic-feelings': [
    'canonical/03-homeostatic',
    'concepts/interoception'
  ],
  'autopoiesis': [
    'canonical/04-autopoiesis',
    'concepts/enactivism'
  ],
  'language-networks': [
    'canonical/05-language'
  ],
  'controllosphere': [
    'canonical/06-controllosphere',
    'concepts/controllosphere',
    'concepts/intrinsic-manifold'
  ],
  'configuration-constraint': [
    'canonical/08-configuration',
    'concepts/h-omega',
    'concepts/affordance'
  ],
  'nested-blankets': [
    'canonical/07-nested-blankets'
  ],
  'consciousness': [
    'concepts/consciousness'
  ],
  'empirical-predictions': [
    'evidence/predictions'
  ]
};

/**
 * Get demo information for a given note ID
 */
export function getDemoForNote(noteId) {
  return NOTE_TO_DEMO_MAP[noteId] || null;
}

/**
 * Get related notes for a given Explorer section slug
 */
export function getNotesForDemo(sectionSlug) {
  return DEMO_TO_NOTES_MAP[sectionSlug] || [];
}

/**
 * Check if a note has an associated interactive demo
 */
export function hasDemo(noteId) {
  return noteId in NOTE_TO_DEMO_MAP;
}