// Section configuration for the Explorer
// Each section defines its content, simulation, and bibliography references
// UPDATED: Section numbers now match vault file numbers

export const SECTIONS = [
  {
    id: 'intro',
    slug: 'introduction',
    number: null,
    title: 'The Dynamics of Cognition',
    subtitle: 'Scale-free biological intelligence from cells to societies',
    simulation: null, // Intro has no simulation
    references: ['friston2010', 'friston2023', 'levin2021', 'damasio2021'],
    isIntro: true,
  },
  {
    id: 'free-energy',
    slug: 'free-energy',
    number: 1,
    title: 'Free Energy Minimization',
    subtitle: 'The mathematical foundation of self-organization',
    simulation: 'markov-blanket', // Primary simulation
    additionalSims: ['free-energy'], // Additional simulations in this section
    references: ['friston2010', 'friston2013', 'friston2023', 'kirchhoff2018', 'bruineberg2022'],
  },
  {
    id: 'morphogenesis',
    slug: 'bioelectric-networks',
    number: 2,
    title: 'Bioelectric Networks',
    subtitle: 'Scaling cellular intelligence into anatomical cognition',
    simulation: 'morphogenesis',
    references: ['levin2021', 'levin-dennett2020', 'durant2017', 'vandenberg2012', 'murugan2022', 'friston2015'],
  },
  {
    id: 'homeostatic',
    slug: 'homeostatic-feelings',
    number: 3,
    title: 'Homeostatic Feelings',
    subtitle: 'The phenomenal substrate of consciousness',
    simulation: 'homeostatic',
    additionalSims: ['interoceptive-pathway'],
    references: [
      'damasio1994', 'damasio2021', 'damasio2022', 'damasio2024',
      'seth2013', 'seth-friston2016',
      'craig2002', 'craig2009',
      'barrett2017',
      'critchley2004', 'garfinkel2015', 'critchley-garfinkel2017'
    ],
  },
  {
    id: 'autopoiesis',
    slug: 'autopoiesis',
    number: 4,
    title: 'Autopoiesis',
    subtitle: 'Self-producing organization as the ground of intelligence',
    simulation: 'autopoiesis',
    references: ['maturana-varela1980', 'varela1991', 'thompson2007', 'kirchhoff2018'],
  },
  {
    id: 'language',
    slug: 'language-networks',
    number: 5,
    title: 'Language Networks',
    subtitle: 'Somatic simulation for communication',
    simulation: 'language-controller',
    references: ['fedorenko2011', 'fedorenko2024a', 'fedorenko2024b', 'shain2020', 'paunov2019', 'tuckute2024'],
  },
  {
    id: 'controllosphere',
    slug: 'controllosphere',
    number: 6,
    title: 'The Controllosphere',
    subtitle: 'Expertise as manifold migration',
    simulation: 'controllosphere',
    additionalSims: ['fatigue-recovery'],
    references: ['holroyd2024'],
  },
  {
    id: 'configuration',
    slug: 'configuration-constraint',
    number: 7,
    title: 'The Configuration Constraint',
    subtitle: 'H(ω) and the bridging problem',
    simulation: 'annealing',
    additionalSims: ['energy-affordance', 'csp-experiment'],
    references: [
      'vangelder1995', 'kelso1995', 'thelen-smith1994', 'tognoli-kelso2014',
      'chemero2009', 'noe2004', 'gibson1979', 'varela1991',
      'porges2009', 'ogden2006', 'levine2010', 'payne-levine2015',
      'vanderkolk2014', 'vanderkolk-yoga2014',
      'barrett-allostasis2016', 'carhart-harris2014', 'carhart-harris-friston2019',
      'kirkpatrick1983'
    ],
  },
  {
    id: 'predictions',
    slug: 'empirical-predictions',
    number: 8,
    title: 'Empirical Predictions',
    subtitle: 'Testing the framework',
    simulation: 'predictive-coding',
    references: [
      'vanderkolk2014', 'vanderkolk-yoga2014', 'ogden2006', 'levine2010', 'payne-levine2015',
      'carhart-harris2014', 'carhart-harris-friston2019',
      'porges2009', 'garfinkel2015', 'critchley-garfinkel2017',
      'barrett-allostasis2016', 'kelso2021', 'sutton1999'
    ],
  },
  {
    id: 'nested',
    slug: 'nested-blankets',
    number: 9,
    title: 'Nested Markov Blankets',
    subtitle: 'Scale-free architecture from molecules to societies',
    simulation: 'nested-blankets',
    references: ['palacios2020', 'ciaunica2023', 'kirchhoff2018'],
  },
  {
    id: 'consciousness',
    slug: 'consciousness',
    number: 10,
    title: 'Consciousness & Meta-Modeling',
    subtitle: 'When the model models itself',
    simulation: 'meta-modeling',
    additionalSims: ['cognitive-horizon', 'configuration-awareness'],
    references: ['damasio2021', 'damasio2022', 'friston2023'],
  },
  {
    id: 'critique',
    slug: 'critical-perspectives',
    number: 11,
    title: 'Critical Perspectives',
    subtitle: 'Honest gap acknowledgment',
    simulation: null,
    references: ['bruineberg2022'],
  },
  {
    id: 'synthesis',
    slug: 'synthesis',
    number: 12,
    title: 'Synthesis',
    subtitle: 'The unified picture',
    simulation: null,
    references: [
      'friston2010', 'friston2023', 'levin2021', 'damasio2021',
      'kelso1995', 'kelso2021', 'holroyd2024', 'barrett2017', 'sutton1999',
      'vangelder1995', 'chemero2009', 'thompson2007'
    ],
    isSynthesis: true,
  },
];

// Map simulation IDs to components (for lazy loading)
export const SIMULATION_MAP = {
  'markov-blanket': 'MarkovBlanketSim',
  'free-energy': 'FreeEnergySim',
  'morphogenesis': 'MorphogenesisSim',
  'homeostatic': 'HomeostaticSim',
  'interface-dynamics': 'InterfaceDynamicsSim',
  'interoceptive-pathway': 'InteroceptivePathwaySim',
  'autopoiesis': 'AutopoiesisSim',
  'language-controller': 'LanguageControllerSim',
  'controllosphere': 'ControllosphereSim',
  'fatigue-recovery': 'FatigueRecoverySim',
  'annealing': 'AnnealingSim',
  'energy-affordance': 'EnergyAffordanceSim',
  'csp-experiment': 'CSPExperimentSim',
  'predictive-coding': 'PredictiveCodingSim',
  'nested-blankets': 'NestedBlanketsSim',
  'meta-modeling': 'MetaModelingSim',
  'cognitive-horizon': 'CognitiveHorizonSim',
  'configuration-awareness': 'ConfigurationAwarenessSim',
  'attractor': 'AttractorSim',
};

export function getSectionBySlug(slug) {
  return SECTIONS.find(s => s.slug === slug);
}

export function getSectionById(id) {
  return SECTIONS.find(s => s.id === id);
}

export function getNextSection(currentId) {
  const idx = SECTIONS.findIndex(s => s.id === currentId);
  return idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
}

export function getPrevSection(currentId) {
  const idx = SECTIONS.findIndex(s => s.id === currentId);
  return idx > 0 ? SECTIONS[idx - 1] : null;
}
