# Dynamics of Cognition

The question of what constitutes biological intelligence—and whether it operates by common principles from cells to societies—has generated one of the most ambitious theoretical programs in contemporary cognitive science. This synthesis integrates work from mathematical physics, developmental biology, neuroscience, and philosophy to argue that intelligence is not a special property of nervous systems but rather an emergent feature of any self-organizing system that maintains statistical boundaries with its environment. Free energy minimization, implemented through nested Markov blankets, provides the mathematical scaffolding that unifies morphogenesis, homeostatic regulation, neural computation, and conscious experience under a single explanatory framework.

The core insight can be stated simply: **to exist as a distinguishable entity is to infer**—that is, to model and predict one's environment in ways that preserve one's structural and functional integrity. From unicellular organisms navigating chemical gradients to human beings constructing autobiographical narratives, the computational principles remain invariant even as their implementation substrates and temporal scales differ dramatically.


---

## I. Free Energy Minimization

Karl Friston's Free Energy Principle (FEP), first comprehensively articulated in his 2010 *Nature Reviews Neuroscience* paper "The free-energy principle: A unified brain theory?" represents perhaps the most ambitious attempt to derive cognitive phenomena from first principles of physics (Friston, 2010). The framework begins with a deceptively simple observation: any system that persists over time must resist the tendency toward thermodynamic equilibrium, and this resistance can be formalized mathematically.

## The Markov Blanket Formalism

The mathematical architecture rests on the **Markov blanket**—a statistical boundary that separates internal states (μ) from external states (ψ) through sensory states (s) and active states (a). The state partition is:

$$x = (\psi, s, a, \mu)$$

Where the blanket itself is $b = (s, a)$.

The defining property is conditional independence: internal states are conditionally independent of external states given blanket states:

$$\mu \perp \psi \mid b$$

Formally expressed as:

$$p(\mu, \psi \mid s, a) = p(\mu \mid s, a) \cdot p(\psi \mid s, a)$$

This partition emerges naturally in random dynamical systems governed by Langevin dynamics:

$$\frac{dx}{dt} = f(x) + \omega$$

Where $f(x)$ represents deterministic flow and $\omega$ represents stochastic fluctuations (Gaussian white noise).

## Variational Free Energy

The central quantity is **variational free energy** (F), which bounds surprisal from above:

$$F = -\ln p(s) + D_{KL}[q(\psi|\mu) \| p(\psi|s)]$$

Systems minimize free energy through two complementary routes:

**Perceptual inference:** Updates internal states to minimize divergence between beliefs and actual posteriors:

$$\dot{\mu} = -\frac{\partial F}{\partial \mu}$$

**Active inference:** Changes sensory samples through action to confirm predictions:

$$\dot{a} = -\frac{\partial F}{\partial a}$$

These are two routes to the same destination—keeping the system in probable states.

## Existence as Inference

As Friston stated in his 2013 *Journal of the Royal Society Interface* paper "Life as we know it": biological self-organization is "an inevitable and emergent property of any (ergodic) random dynamical system that possesses a Markov blanket" (Friston, 2013).

The philosophical implications are profound. The claim that "to exist is to infer" grounds cognition not in neural computation specifically but in the fundamental physics of self-organizing systems. Any entity that maintains itself at nonequilibrium steady-state necessarily appears to engage in Bayesian inference about its environment. This is not merely a useful metaphor—it is a mathematical consequence of the statistical mechanics of persistence.

Recent formalizations have strengthened this foundation considerably. Friston and colleagues' 2023 *Physics Reports* paper "The free energy principle made simpler but not too simple" provides the most rigorous treatment to date, deriving what they term **Bayesian mechanics**: "a physics of sentience" applicable from quantum scales to social systems (Friston et al., 2023).

## Addressing the Pearl/Friston Blanket Distinction

Critics have argued that a "persistent confusion" exists between the formal use of Markov blankets as an epistemic tool for Bayesian inference (what Bruineberg et al. 2022 call "Pearl blankets") and their metaphysical use to demarcate physical boundaries between agents and environments ("Friston blankets"). This critique, while technically sophisticated, may be less damaging than it initially appears.

The objection assumes a sharp map/territory distinction that is precisely what FEP calls into question. The claim is not "we can usefully model systems as having Markov blankets" but rather that any system maintaining itself at non-equilibrium steady-state necessarily exhibits the statistical structure that Markov blankets formalize. The blanket is not imposed by the observer; it is a consequence of the system's existence as a distinguishable entity.

Consider what it would mean for a self-organizing system to exist without conditional independence between its internal states and the environment given its boundary states. If there were no such independence, there would be no meaningful sense in which the system has an "inside" and an "outside." The system would not be a system—it would simply be part of the background thermodynamic soup.

The genuine problem is not the statistical/metaphysical distinction but rather the question of *which* Markov blanket partition is the correct one. Any complex system admits multiple valid Markov blanket decompositions at different scales and granularities. The formalism alone does not specify whether to draw the blanket around a cell, an organ, an organism, or a social group. This is the "boundary problem"—not whether blankets are real, but which blankets matter for which explanatory purposes. The nested architecture developed below addresses this directly.


---

## II. Bioelectric Networks

Michael Levin's research program at Tufts University provides the most compelling empirical evidence that intelligence operates by scale-invariant principles. His work demonstrates that developmental and regenerative biology can be understood as **morphogenetic computation**—goal-directed problem-solving in anatomical morphospace rather than three-dimensional behavioral space.

## The Bioelectric Code

The conceptual revolution centers on the **bioelectric code**. All cells maintain resting membrane potentials through ion channel and pump activity, and these voltage gradients constitute informational signals that store anatomical patterning instructions. Gap junctions—electrical synapses formed by Connexin proteins—create direct cytoplasmic connections between cells, enabling rapid sharing of voltage states and forming computational networks across tissues.

As Levin argues in his landmark 2021 *Cell* paper "Bioelectric signaling: Reprogrammable circuits underlying embryogenesis, regeneration, and cancer": these bioelectrical networks "process morphogenetic information that controls gene expression, enabling cell collectives to make decisions about large-scale growth and form" (Levin, 2021).

## Key Experimental Demonstrations

Three experimental demonstrations crystallize this theoretical framework:

**Planarian two-headed regeneration:** Brief exposure to octanol (which blocks gap junctions) can permanently rewrite the anatomical "target morphology" stored in bioelectric circuits—producing flatworms that regenerate as two-headed forms for multiple generations without any genetic modification (Durant et al., 2017). The genome has not changed; the bioelectric "software" has been reprogrammed.

**"Picasso tadpole" experiments:** *Xenopus* embryos with scrambled craniofacial organs will self-correct over months, with facial structures migrating along novel paths to reach correct final positions (Vandenberg, Adams, & Levin, 2012). The cells know what the target configuration should be and find novel routes to achieve it.

**Xenopus limb regeneration:** Adult frogs receiving just 24 hours of progesterone exposure via wearable bioreactor initiated 18 months of limb regeneration, producing functional legs with bone structure, nerve integration, and locomotor capability (Murugan et al., 2022). A brief trigger initiated autonomous, goal-directed behavior lasting nearly two years.

## Free Energy Implementation

From the perspective of free energy minimization, bioelectric networks implement morphogenetic control through:

**Active inference over anatomical configurations:** Cells minimize free energy not in behavioral space but in morphospace—continuously inferring the current anatomical state against a "target morphology" encoded in bioelectric setpoints.

**Distributed generative models:** Gap junction-coupled cell networks collectively maintain generative models of normal anatomical configurations, enabling pattern completion and error correction.

**Hierarchical prediction:** Larger-scale bioelectric patterns constrain local cellular behaviors, instantiating exactly the hierarchical structure that nested Markov blankets formalize.

## Implications for Cognition

The deeper implication is that nervous systems are not the origin of intelligence but rather a *speed optimization* for pre-existing cellular competencies. As Levin and Dennett (2020) argue in "Cognition All the Way Down," evolution did not need to invent intelligence when brains appeared—it needed only to accelerate and extend capabilities already present in living systems.

This reframes the "scale-free" claim concretely: the same computational principles apply whether the system is a cell collective navigating morphospace to maintain anatomical integrity, or a brain navigating belief-space to maintain predictive accuracy.


---

## III. Homeostatic Regulation

Antonio Damasio's research program, developed over three decades at USC and elsewhere, provides the phenomenological and neurobiological complement to the more formal frameworks. His central thesis: consciousness and intelligent behavior are grounded in the body's continuous project of self-regulation—homeostasis in the broad sense of maintaining the conditions required for flourishing.

## The Somatic Marker Hypothesis

The **somatic marker hypothesis**, first articulated in the 1996 *Philosophical Transactions* paper "The somatic marker hypothesis and the possible functions of the prefrontal cortex," proposes that decision-making involves re-experiencing bodily states associated with past outcomes (Damasio, 1996).

The mechanism: ventromedial prefrontal cortex stores associations between situation-types and somatic states. When faced with similar situations, these somatic states are reactivated—either as "body loops" (actual physiological changes) or "as-if body loops" (brain-based simulations). These states bias cognition toward options previously associated with favorable outcomes.

This grounds "rational" decision-making in embodied affect. The *Descartes' Error* argument—that emotion is essential rather than opposed to reason—follows directly from this architecture (Damasio, 1994).

## Feelings as Homeostatic Sentinels

Damasio's recent work, synthesized in *Feeling & Knowing* (2021), develops a richer picture of feelings as "mental experiences of body states" that evolved to provide organisms information about their regulatory condition (Damasio, 2021). He distinguishes:

**Homeostatic feelings:** Basic states indicating conditions of the organism's tissues and internal organs—hunger, thirst, pain, well-being.

**Emotional feelings:** More differentiated states triggered by objects and events evaluated as relevant to the organism's situation—fear, anger, compassion.

**Feelings of knowing:** Mental experiences that accompany cognitive activity itself—the feeling of understanding, of doubt, of recognition.

Critically, all three categories are grounded in the body. As stated in the 2024 *Phil Trans* paper "Sensing, feeling and consciousness": feelings "arise from the detection of deviation from homeostatic parameters" and function as "sentinels" alerting the organism to its regulatory condition (Damasio & Damasio, 2024).

## Convergence with Free Energy Minimization

The convergence with Friston's framework becomes clear: Damasio's "homeostatic sentinels" are phenomenal manifestations of prediction errors in interoceptive inference. When bodily states deviate from predicted setpoints, the resulting prediction error generates the phenomenal character we experience as negative affect—hunger, pain, anxiety. When prediction errors are minimized and the body is within viable bounds, we experience positive affect—satiation, comfort, well-being.

As articulated in the 2022 *Brain* paper "Homeostatic feelings and the biology of consciousness": consciousness itself may be understood as what self-regulating systems "feel like from inside" when their complexity exceeds certain thresholds (Damasio & Damasio, 2022).

This provides what the formal framework lacks: phenomenological grounding. Free energy minimization becomes not merely a mathematical description but an experienced reality—the felt urgency of hunger, the pleasure of successful action, the anxiety of uncertainty.

## Feelings as Interface Dynamics

Damasio's insistence on a body-brain *partnership* suggests something deeper than prediction errors within a single system. Consciousness requires two distinct Markov blanketed systems—nervous system and viscera—in active coordination. The interoceptive nervous system's unique properties (unmyelinated neurons, permeable blood-brain barriers, bidirectional neural-non-neural interactions) exist precisely to enable **blanket-to-blanket coupling**.

This reframes the origin of feelings: they arise not merely from prediction errors *within* a system but from the **dynamics at the interface between** Markov blanketed systems. When one system's boundary encounters another's—when the nervous system's blanket meets the viscera's blanket—the dynamics of that interface have phenomenal character.

$$\Phi_{interface} = f(b_1 \cap b_2)$$

Where $b_1$ and $b_2$ are distinct Markov blankets, and the phenomenal character $\Phi$ emerges from their intersection—the region where active states of one become sensory states of the other.

On this view, different feelings correspond to different interface dynamics:

- **Pain** is my body-blanket meeting environmental resistance that threatens its integrity
- **Pleasure** is my body-blanket meeting conditions that sustain or enhance its integrity
- **Effort** (the controllosphere) is my cognitive-blanket attempting to coordinate my motor-blanket toward goals
- **Understanding** is my linguistic-blanket achieving resonance with another mind's blanket
- **Loneliness** is my social-blanket failing to find other blankets to couple with

## Dissolving the Hard Problem

The so-called "hard problem" of consciousness assumes a framework where physical processes and phenomenal experience are distinct explananda requiring a bridging explanation. But this framework may be misconceived. Damasio's position suggests that feelings are not an additional output produced by homeostatic regulation—**feelings just ARE what self-referential interoceptive modeling IS** when instantiated in a sufficiently complex body.

Crucially, **this is not panpsychism**. Not all physical processes feel like something. The claim is more specific: self-referential modeling of Markov blanket interfaces constitutes phenomenal character when it occurs at sufficient complexity.

The nested architecture predicts that phenomenal character scales with interface complexity:

- **Cellular interfaces** involve proto-valence—basic chemistry of stress and flourishing
- **Organ-level interfaces** produce visceral feelings—hunger, fatigue, gut sense
- **Organism-level interfaces** generate emotions as body-environment relationships are modeled
- **Social interfaces** yield feelings of connection, shame, pride, understanding

There is no magic threshold where non-feeling becomes feeling. The transition is continuous.


---

## IV. Autopoietic Organization

Maturana and Varela's concept of **autopoiesis**—self-production—provides a theoretical framework that complements both the bioelectric and homeostatic perspectives (Maturana & Varela, 1980). Autopoietic systems are organized such that their component processes produce the very components that maintain the organization that produces them.

## The Formal Definition

An autopoietic system is defined by:

**Bounded network:** A network of processes occurring within a boundary.

**Component production:** Processes that produce the components constituting the network.

**Boundary production:** Processes that produce and maintain the boundary itself.

**Organizational closure:** The network's organization is invariant even as its components change.

The cell exemplifies this: metabolic processes produce lipids that constitute the membrane that contains the metabolic processes that produce the lipids. The organization is self-producing and self-maintaining.

## Autopoiesis and Markov Blankets

The connection to Markov blankets is direct: the autopoietic boundary IS the Markov blanket—the statistical partition between internal and external states. What autopoiesis adds is the recognition that this boundary is not passive but actively produced and maintained by the very processes it bounds.

As Kirchhoff et al. (2018) argue in "The Markov blankets of life": autopoietic organization explains *why* biological systems maintain Markov blanket structure—because maintaining that structure IS what it means to be alive.

## The Enactivist Connection

The enactivist tradition following from autopoiesis (Thompson, 2007; Varela, Thompson, & Rosch, 1991) emphasizes that cognition is not representation of a pre-given world but *enaction*—the bringing forth of a world through embodied activity. The organism and environment are structurally coupled, each specifying the conditions for the other's existence.

This connects directly to active inference: the organism does not passively receive information about an external world but actively samples its environment in ways that confirm its expectations and maintain its viability. The Markov blanket is not a passive filter but an active interface through which the organism enacts its world.


---

## V. Language Networks

Evelina Fedorenko's neuroimaging research at MIT provides the most systematic contemporary characterization of language processing in the human brain. Her work establishes that language is implemented in a functionally selective, left-lateralized network that responds preferentially to linguistic stimuli across modalities and languages.

## Functional Selectivity

The language network shows remarkable functional specificity. As documented in Fedorenko, Behr, & Kanwisher (2011) and extensively validated since: language regions respond strongly to sentences but minimally to degraded linguistic stimuli, non-linguistic cognitive tasks, or non-human primate vocalizations.

The network's components are robustly identifiable across individuals, scanners, and experimental paradigms. The left-lateralized fronto-temporal network consistently shows selective activation for linguistic processing.

## Surprisal Modulates Activation

Critically for free energy interpretations: neural activation in language regions tracks *surprisal*—the negative log probability of each word given context. As Shain et al. (2020) demonstrate, "fMRI reveals language-specific predictive coding during naturalistic sentence comprehension." The brain implements precisely the predictive processing that FEP formalizes.

## The Open-Loop Problem

However, a fundamental problem emerges when we consider Fedorenko's paradigm in light of control theory.

Standard neuroimaging of language processing operates in what control engineers call **open-loop** conditions. Participants receive carefully controlled linguistic stimuli—often pre-recorded, visually presented, with no possibility of affecting the speaker's output. They passively process input that arrives independently of anything they do.

But natural language use is **closed-loop**: speakers monitor listeners' reactions and adjust their output accordingly; listeners signal comprehension or confusion through backchannels, questions, facial expressions. Real communication involves continuous mutual prediction and adjustment—exactly what Markov blankets formalize as the sensory-active interface between coupled systems.

## What She Measures vs. What Real Communication Requires

This creates a systematic gap between what Fedorenko's paradigm measures and what evolved language capacity actually does:

| Paradigm Feature | Natural Communication |
|------------------|----------------------|
| Input controlled by experimenter | Input controlled by communicative dynamics |
| No effect of comprehension on input | Continuous mutual adjustment |
| Surprisal from statistical regularities | Surprisal from partner modeling |
| Language as reception | Language as coordination |

The language network Fedorenko identifies is real and important—but she may be characterizing it in conditions that systematically eliminate its core function.

## Reinterpreting Her Findings

**Functional selectivity:** The language network may be specialized not for "language" in the abstract but for the specific computational demands of real-time communicative coordination.

**Dissociation from Theory of Mind:** Fedorenko emphasizes that language regions are distinct from Theory of Mind networks. But in closed-loop communication, language IS theory of mind in action—using linguistic signals to update models of what your partner knows and wants.

**LLM alignment:** Tuckute et al. (2024) show that large language models drive the human language network effectively. But LLMs are trained on exactly the kind of passive, open-loop processing that neuroimaging paradigms use. The alignment may confirm that the paradigm captures only the pattern-matching aspect of language, not its communicative control function.

## Language and Scale-Free Intelligence

Viewed through the scale-free framework: language is how nervous systems couple their Markov blankets across gaps too wide for direct contact. Where gap junctions couple cells directly, and hormones couple organs within bodies, language couples minds across bodies.

Fedorenko's emphasis that "language is primarily a tool for communication rather than thought" (Fedorenko, Piantadosi, & Gibson, 2024) supports this view: language evolved not to enhance individual cognition but to reduce uncertainty across the social blanket.


---

## VI. The Controllosphere

Clay Holroyd's 2024 *Psychological Review* paper "The controllosphere: The neural origin of cognitive effort" offers a framework for understanding why thinking feels like work—why cognitive effort has phenomenal character analogous to physical exertion.

## The Architecture

The "controllosphere" refers to the neural architecture responsible for motivated, goal-directed control of behavior and thought. Its core components include:

**Anterior cingulate cortex (ACC):** The "controller of controllers"—monitors performance, detects conflicts, and allocates cognitive resources.

**Basal ganglia:** Gating mechanisms that select which actions and representations gain access to working memory and motor output.

**Dopaminergic systems:** Signal expected value and motivate effortful engagement when potential rewards justify metabolic costs.

The system integrates information about goals, current state, and metabolic resources to determine how much cognitive effort to expend.

## Cognitive Effort as Metabolic Cost

The key insight: cognitive effort is not metaphorically but literally metabolic. Neural computation consumes glucose and oxygen. The brain, representing ~2% of body mass, consumes ~20% of metabolic resources. Demanding cognitive tasks increase local metabolic demands.

The "effort" we experience in difficult thinking reflects real resource allocation decisions—the same kind of cost-benefit computation that governs physical exertion. The feeling of mental fatigue is not illusion but accurate interoception of neural metabolic states.

This connects to the thermodynamic grounding of cognition: configuration has costs, and the controllosphere manages ATP budgets.

## Free Energy Connection

This connects directly to free energy minimization. Minimizing free energy requires updating internal models and generating actions—both metabolically costly processes. The controllosphere implements the decision of *how much* model-updating and action-generation to perform given current resources and goals.

The feeling of cognitive effort is the phenomenology of this decision process—what it feels like when the system is deciding whether the expected uncertainty reduction justifies the metabolic cost.

## The Intrinsic Manifold

Holroyd's key distinction:

- **Intrinsic manifold:** Configurations the system can sustain cheaply—default states, habitual responses
- **Controllosphere:** Configurations requiring continuous metabolic expenditure to maintain—effortful cognition

The intrinsic manifold represents H(ω)—mappings the current configuration can sustain within normal ATP budget. The controllosphere represents h ∉ H(ω)—mappings requiring DLPFC-driven metabolic expenditure.


---

## VII. Nested Markov Blankets

The architectural principle that unifies all preceding frameworks is **nested Markov blankets**—blankets within blankets, forming hierarchies of increasingly encompassing partitions.

## The Formal Structure

At each level, the same formal structure applies:

$$x^{(n)} = (\psi^{(n)}, s^{(n)}, a^{(n)}, \mu^{(n)})$$

Where level-$n$ external states $\psi^{(n)}$ become level-$(n+1)$ internal states $\mu^{(n+1)}$, and so on. The blanket at each level separates what's "inside" from what's "outside" relative to that scale of organization.

## Empirical Instantiation

The biological hierarchy instantiates this precisely:

| Level | Internal States | Blanket | External States |
|-------|-----------------|---------|-----------------|
| Organelle | Organelle metabolism | Organelle membrane | Cytoplasm |
| Cell | Cytoplasm + organelles | Cell membrane | Tissue environment |
| Organ | Cells + ECM | Organ boundary | Other organs |
| Organism | Organs + nervous system | Body boundary | Physical environment |
| Social | Individuals + institutions | Social norms | Other groups |

At each level, the same computational principle applies: minimize free energy, maintain blanket integrity, predict external states from internal models.

## Information Flow

Crucially, higher levels constrain lower levels. The organism's goal of maintaining body temperature constrains cellular metabolic activity. Cellular integrity constrains molecular reaction networks. Social norms constrain individual behavior.

This is not mere analogy—it is the same mathematical structure at different scales. The "downward causation" that seems mysterious in other frameworks becomes simply the constraint that higher-level blanket maintenance places on lower-level dynamics.

## Connections Across the Framework

- Bioelectric networks: Gap junctions couple cells into tissue-level blankets
- Homeostatic regulation: Interface dynamics between nervous system and viscera
- Autopoiesis: Self-producing boundary = self-maintaining blanket
- Language: Couples individual blankets into social blankets


---

## VIII. Configuration Constraint

The preceding framework establishes that self-organizing systems minimize free energy through nested Markov blankets. What remains underspecified is how these dynamics constrain cognition in real time—why certain thoughts are accessible to an organism at a given moment while others remain unreachable. The concept of **annealing**, imported from statistical physics, provides the missing mechanism: cognition is not computation happening "in" a body but rather the body's current configuration expressing itself.

## Dynamical Systems Ground Cognition

Tim van Gelder's landmark 1995 paper "What Might Cognition Be, If Not Computation?" articulates the *dynamical hypothesis*: cognition is not like a dynamical system—it IS one. Cognitive states are positions in state space; cognitive processes are trajectories through that space.

J.A. Scott Kelso's coordination dynamics demonstrates this concretely. His work on **metastability** shows that stable cognitive patterns correspond to attractors—regions of state space the system tends to occupy. The HKB model reveals how phase transitions exemplify broader principles: when parameters shift, the system can suddenly access previously unreachable configurations (Kelso, 1995).

Thelen and Smith's developmental work provides empirical grounding: **"the brain is not the 'controller' of behavior"**—one must understand how brain capitalizes on body dynamics and how body informs brain.

## The Body as Configuration Space

The critical extension is recognizing that the relevant configuration space is **the entire body**, not merely neural state space. At any moment, the organism occupies a point in an extraordinarily high-dimensional space comprising:

- Neural firing patterns
- Neurotransmitter concentrations
- Hormonal profiles
- Autonomic nervous system state
- Metabolic states
- Bioelectric gradients
- Muscle tension distributions
- Interoceptive signals
- Respiratory and cardiac rhythms

**A thought is not retrieved from storage but is rather a trajectory through this space that the system can actually traverse** given its current configuration.

## Radical Embodiment: The Identity Claim

The *radical* embodied cognition thesis holds that cognition IS bodily activity. This is explicitly anti-representationalist.

Gibson's ecological psychology grounds this in perception. Affordances—what the environment offers the animal—exist only relative to the organism's bodily capabilities. If perception requires bodily engagement with affordances, and cognition emerges from perception-action cycles, then cognition cannot exceed what the body can configure.

This is not dualism nor standard embodied cognition. It is **identity**: the thought IS the configuration.

## Autonomic State Constrains Possibility

Stephen Porges's polyvagal theory provides the clinical bridge: **"physiological state limits the range of behavior and psychological experience."** This is not merely influence but constraint.

Pat Ogden's **window of tolerance** operationalizes this clinically. Outside the window—in hyperarousal or hypoarousal—individuals become "cognitively disabled." Integration and flexible cognition become impossible when the body is configured for survival rather than engagement.

## Trauma as Frozen Configuration

Peter Levine's somatic experiencing framework describes trauma as frozen bodily configuration that constrains psychological possibility. Traumatic memory is not stored representation but **embodied configuration**—patterns of muscle tension, autonomic reactivity, hormonal setpoints that constitute ongoing threat-response.

Van der Kolk's empirical work: his 2014 RCT of yoga for treatment-resistant PTSD found that **52% of the yoga group no longer met PTSD criteria** versus 21% of controls. The body-based intervention enabled cognitive/emotional changes that cognition-based approaches could not access.

## Formalizing the Constraint: H(ω)

Drawing on Kelso's coordination dynamics, Barrett's interoceptive inference, the Options framework (Sutton, Precup, & Singh, 1999), and Holroyd's controllosphere, we propose:

$$H(\omega) = \{h \in H : \omega \in I_h\}$$

Where:
- **Ω** is the space of body configurations
- **ω ∈ Ω** is a specific configuration
- **H** is the full space of possible interpretive/action mappings
- **I_h** is the *initiation set* for mapping h
- **H(ω)** is the subset of H accessible when in configuration ω

**The critical distinction:** H(ω) differs from precision-weighting. Precision assigns weight within a fixed space. H(ω) removes hypotheses from the space entirely. This is the difference between a radio station at very low volume versus outside the receiver's frequency range.

## Configuration Has Costs: Thermodynamic Grounding

The answer to *why* these constraints exist lies in thermodynamics. **Configuration space isn't freely navigable—it's a landscape with metabolic costs.**

- Brain consumes ~**20 watts**—20% of resting metabolism for 2% of body mass
- Na⁺/K⁺-ATPase pump: 55-75% of total brain ATP
- **Communication costs 35x more than computation**
- Fewer than 1% of cortical neurons substantially active concurrently
- Sparse coding is thermodynamic necessity

This grounds Holroyd's controllosphere in physics:

- **Intrinsic manifold**: Configurations sustainable within normal ATP budget
- **Controllosphere**: Configurations requiring continuous metabolic expenditure beyond baseline
- **Fatigue**: Body enforcing thermodynamic limits via waste accumulation

The refined formalization:

$$H(\omega) = \{h \in H : \omega \in I_h \land \text{thermodynamically sustainable}\}$$

Configuration determines what's possible; metabolism determines what's sustainable.


---

## IX. The Synthesis

Drawing together the preceding threads, we can now articulate the unified model in its full scope.

## The Core Architecture

| Level | Description |
|-------|-------------|
| **Level 0 – Physics** | Random dynamical systems governed by Langevin dynamics naturally partition into Markov blanket structures when they maintain themselves at nonequilibrium steady-state. |
| **Level 1 – Life** | Living systems are characterized by autopoietic organization—operationally closed networks of processes that produce themselves and their boundaries. |
| **Level 2 – Cellular intelligence** | Cells maintain sophisticated inference machinery, implementing Bayesian inference over their local environments. Bioelectric networks enable collective computation. |
| **Level 3 – Homeostatic regulation** | Multicellular organisms develop hierarchical regulatory systems that maintain viability through continuous inference about body states. Feelings as sentinels. |
| **Level 4 – Neural cognition** | Nervous systems implement rapid, flexible inference through specialized computational architectures. |
| **Level 5 – Self-modeling** | Sufficiently complex systems develop generative models that include representations of their own Markov blanket structure. Consciousness emerges. |
| **Level 6 – Social cognition** | Individual Markov blankets can be nested within higher-level social blankets, enabling collective inference and shared intentionality. |

## Illuminating Phenomena

This architecture illuminates several otherwise puzzling phenomena:

**Language** can be understood as a specialized control system that enables organisms to share predictions across individual Markov blankets—minimizing the entropy of communicative outcomes. The language network is a communicative uncertainty controller.

**Neural modules** can be reframed as "frozen solutions to recurring regulatory demands"—stable patterns of organization that emerge through repeated minimization of the same free energy landscapes.

**Consciousness** can be characterized as "what self-modeling feels like from inside"—the phenomenal character that accompanies systems with sufficiently deep hierarchies of self-referential inference.

**Affordances** exist at the intersection of body capabilities and environmental structure. The H(ω) formalization shows why: the affordance field just IS what's accessible from the current configuration.

## The Key Integrations

### Free Energy + Thermodynamics
Variational free energy and thermodynamic (Gibbs) free energy share the form F = Energy - Entropy. Stochastic thermodynamics provides the bridge: prediction-efficiency equivalence means systems optimized for energy must be optimized for prediction.

### Body + Mind (Identity, not Interaction)
The configuration constraint establishes that thought IS configuration, not computation happening "in" a body. H(ω) formalizes what can be thought from a given bodily state.

### Interface + Phenomenology
Feelings arise not from prediction errors within a single system but from dynamics at the interface between Markov blanketed systems. Pain, pleasure, effort, understanding, loneliness—all are interface dynamics.


---

## X. Critical Perspectives

## The Emperor's New Markov Blankets

Bruineberg et al. (2022) argue that FEP proponents conflate two distinct notions of Markov blanket: the "Pearl blanket" (an epistemic tool) and the "Friston blanket" (a metaphysical boundary). The criticism has force: merely showing that a system CAN be modeled as having a Markov blanket does not establish that the blanket is doing explanatory work.

**Response:** The criticism may apply to loose applications of FEP but not to the core framework. When properly understood, the claim is not that we can model systems with blankets but that systems maintaining themselves at nonequilibrium necessarily exhibit blanket structure. The blanket is not imposed but discovered.

## The Tautology Concern

Critics argue that FEP is unfalsifiable—that any behavior can be redescribed as free energy minimization. This critique has merit as a caution against overly flexible interpretation but may miss the framework's genuine empirical content.

The framework generates specific predictions:
- Inference should approximate Bayesian optimality
- Surprisal should modulate neural activity
- Bodily states should constrain cognitive accessibility

These are testable claims. See Empirical Predictions for specifics.

## The Hard Problem Reconsidered

The hard problem of consciousness—why functional organization should be accompanied by phenomenal experience—assumes that physical processes and phenomenal experience are distinct explananda. The framework developed here challenges this assumption.

If feelings just ARE what self-referential interface modeling IS at sufficient complexity, then there is no gap requiring a bridging explanation.

**Objection:** This merely relocates the mystery: why should self-referential interface modeling feel like anything?

**Response:** This objection presupposes the very framework being rejected. The question assumes that "feeling like something" is an additional property beyond the structural and dynamical properties of the system. The Damasio-informed position denies this: phenomenal character is not an additional property but rather what certain structural-dynamical configurations ARE from inside.

This is not eliminativism—we are not denying that feelings exist. We are denying that phenomenal character requires explanation in terms of something more fundamental.

The question becomes empirical: which interface configurations produce which phenomenal signatures, and how do they compose into the rich texture of conscious experience?

## The Nativism Question

Fedorenko's acknowledgment that she cannot explain why experience-dependent development produces consistent localization suggests fundamental gaps in current understanding. The open-loop critique developed in Language Networks suggests that her paradigm may be systematically missing the closed-loop communicative control dynamics that shaped the evolution of the language network.

## Scale Attribution Problem

The standards for attributing cognition across biological scales require refinement. When does a cell "infer" versus merely "respond"? Is bioelectric computation truly "cognitive"? These conceptual clarifications remain ongoing.


---

## XI. Future Directions

## What the Synthesis Achieves

The synthesis presented here proposes that intelligence is not a special property emerging at some threshold of neural complexity but rather a fundamental feature of self-organizing systems that maintain statistical boundaries with their environments.

The specific contributions include:

- **Mathematical unification:** Free energy minimization provides a common formal framework
- **Scale-free architecture:** Nested Markov blankets enable the same computational principles at multiple scales
- **Phenomenological grounding:** Damasio's homeostatic framework grounds the mathematical formalism in embodied experience
- **Interface phenomenology:** Feelings arise from dynamics at the interface between Markov blanketed systems
- **Hard problem dissolution:** Phenomenal character is not an additional property but what self-referential interface modeling IS at sufficient complexity
- **Communicative control:** Language is reframed as a specialized uncertainty controller
- **Configuration constraint:** H(ω) formalizes how bodily state constrains cognitive accessibility
- **Thermodynamic grounding:** ATP budgets are not implementation details but constitutive constraints

## What Remains Unresolved

### Conceptual Work
- Standards for attributing cognition across biological scales require refinement
- The mechanisms by which experience-dependent development produces consistent neural organization demand explanation
- The closed-loop dynamics of communicative control remain largely unstudied

### Empirical Work
- Mapping initiation sets for different cognitive strategies
- Relating H(ω) to measurable physiological parameters
- Testing the thermodynamic predictions (Predictions 6-10)
- Designing closed-loop language paradigms

### Theoretical Work
- Formalizing affordance dissolution under trauma
- Connecting bioelectric morphogenesis to neural cognition more rigorously
- Understanding how social blankets constrain individual cognition

## Possible Experimental Program

Priority experiments to test the framework:

1. **Glucose-Horizon Correlation** — Track cognitive flexibility across glucose levels
2. **Metabolic Affordance Scaling** — Decision tasks under metabolic manipulation
3. **Recovery Timecourses** — H(ω) expansion tracking glycogen resynthesis
4. **Expert vs Novice Initiation Sets** — Configuration tolerance under perturbation

See Empirical Predictions for full details.

## The Broader Vision

Intelligence, on this account, is not a mysterious addition to the physical world but an inevitable consequence of the statistical mechanics of persistence—a principle that applies wherever distinguishable entities maintain themselves against thermodynamic dissolution.

The convergence of mathematical physics, developmental biology, neuroscience, and philosophy on shared principles represents significant theoretical progress. The work ahead is to test these principles, refine them, and ultimately use them to understand—and perhaps enhance—the dynamics of cognition.


---

## References

Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience*, 11(2), 127-138. https://doi.org/10.1038/nrn2787

Friston, K. (2013). Life as we know it. *Journal of the Royal Society Interface*, 10(86), 20130475. https://doi.org/10.1098/rsif.2013.0475

Friston, K., et al. (2023). The free energy principle made simpler but not too simple. *Physics Reports*, 1024, 1-29. https://doi.org/10.1016/j.physrep.2023.07.001

Friston, K., Levin, M., Sengupta, B., & Pezzulo, G. (2015). Knowing one's place: a free-energy approach to pattern regulation. *Journal of the Royal Society Interface*, 12(105), 20141383. https://doi.org/10.1098/rsif.2014.1383

Kirchhoff, M., Parr, T., Palacios, E., Friston, K., & Kiverstein, J. (2018). The Markov blankets of life: autonomy, active inference and the free energy principle. *Journal of the Royal Society Interface*, 15(138), 20170792. https://doi.org/10.1098/rsif.2017.0792

Palacios, E., Razi, A., Parr, T., Kirchhoff, M., & Friston, K. (2020). On Markov blankets and hierarchical self-organisation. *Journal of Theoretical Biology*, 486, 110089. https://doi.org/10.1016/j.jtbi.2019.110089

Bruineberg, J., Dołęga, K., Dewhurst, J., & Baltieri, M. (2022). The Emperor's New Markov Blankets. *Behavioral and Brain Sciences*, 45, e183. https://doi.org/10.1017/S0140525X21002351

Levin, M. (2021). Bioelectric Signaling: Reprogrammable Circuits Underlying Embryogenesis, Regeneration, and Cancer. *Cell*, 184(8), 1971-1989. https://doi.org/10.1016/j.cell.2021.02.034

Levin, M., & Dennett, D. C. (2020). Cognition All the Way Down. *Aeon Essays*. https://aeon.co/essays/how-to-understand-cells-tissues-and-organisms-as-agents-with-agendas

Durant, F., et al. (2017). Long-Term, Stochastic Editing of Regenerative Anatomy via Targeting Endogenous Bioelectric Gradients. *Biophysical Journal*, 112(10), 2231-2243. https://doi.org/10.1016/j.bpj.2017.04.011

Murugan, N. J., et al. (2022). Acute Multidrug Delivery via a Wearable Bioreactor Facilitates Long-Term Limb Regeneration and Functional Recovery in Adult Xenopus laevis. *Science Advances*, 8(4), eabj2164. https://doi.org/10.1126/sciadv.abj2164

Vandenberg, L. N., Adams, D. S., & Levin, M. (2012). Normalized Shape and Location of Perturbed Craniofacial Structures in the Xenopus Tadpole Reveal an Innate Ability to Achieve Correct Morphology. *Developmental Dynamics*, 241(5), 863-878. https://doi.org/10.1002/dvdy.23770

Ciaunica, A., Levin, M., Rosas, F., & Friston, K. (2023). Nested Selves: Self-Organization and Shared Markov Blankets in Prenatal Development in Humans. *Topics in Cognitive Science*. https://doi.org/10.1111/tops.12717

Damasio, A. (1994). *Descartes' Error: Emotion, Reason, and the Human Brain*. Putnam. ISBN: 978-0-380-72647-5

Damasio, A. (1996). The somatic marker hypothesis and the possible functions of the prefrontal cortex. *Philosophical Transactions of the Royal Society B*, 351(1346), 1413-1420. https://doi.org/10.1098/rstb.1996.0125

Damasio, A. (2021). *Feeling & Knowing: Making Minds Conscious*. Pantheon Books. ISBN: 978-0-375-42316-8

Damasio, A., & Damasio, H. (2022). Homeostatic feelings and the biology of consciousness. *Brain*, 145(7), 2231-2235. https://doi.org/10.1093/brain/awac194

Damasio, A., & Damasio, H. (2024). Sensing, feeling and consciousness. *Philosophical Transactions of the Royal Society B*, 379(1908), 20230243. https://doi.org/10.1098/rstb.2023.0243

Barrett, L. F., Quigley, K. S., & Hamilton, P. (2016). An active inference theory of allostasis and interoception in depression. *Philosophical Transactions of the Royal Society B*, 371, 20160011. https://doi.org/10.1098/rstb.2016.0011

Maturana, H. R., & Varela, F. J. (1980). *Autopoiesis and Cognition: The Realization of the Living*. D. Reidel Publishing. ISBN: 978-90-277-1015-8

Varela, F. J., Thompson, E., & Rosch, E. (1991). *The Embodied Mind: Cognitive Science and Human Experience*. MIT Press. ISBN: 978-0-262-72021-2

Thompson, E. (2007). *Mind in Life: Biology, Phenomenology, and the Sciences of Mind*. Harvard University Press. ISBN: 978-0-674-02511-0

Noë, A. (2004). *Action in Perception*. MIT Press. ISBN: 978-0-262-64047-3

Chemero, A. (2009). *Radical Embodied Cognitive Science*. MIT Press. ISBN: 978-0-262-51358-4

Gibson, J. J. (1979). *The Ecological Approach to Visual Perception*. Houghton Mifflin. ISBN: 978-0-89859-959-6

Fedorenko, E., Behr, M. K., & Kanwisher, N. (2011). Functional specificity for high-level linguistic processing in the human brain. *PNAS*, 108(39), 16428-16433. https://doi.org/10.1073/pnas.1112937108

Fedorenko, E., Ivanova, A. A., & Regev, T. I. (2024). The language network as a natural kind within the broader landscape of the human brain. *Nature Reviews Neuroscience*, 25(5), 289-312. https://doi.org/10.1038/s41583-024-00802-4

Fedorenko, E., Piantadosi, S. T., & Gibson, E. A. F. (2024). Language is primarily a tool for communication rather than thought. *Nature*, 630(8017), 575-586. https://doi.org/10.1038/s41586-024-07522-w

Paunov, A. M., Blank, I. A., & Fedorenko, E. (2019). Functionally distinct language and Theory of Mind networks are synchronized at rest and during language comprehension. *Journal of Neurophysiology*, 121(4), 1244-1265. https://doi.org/10.1152/jn.00619.2018

Shain, C., Blank, I. A., van Schijndel, M., Schuler, W., & Fedorenko, E. (2020). fMRI reveals language-specific predictive coding during naturalistic sentence comprehension. *Neuropsychologia*, 138, 107307. https://doi.org/10.1016/j.neuropsychologia.2019.107307

Tuckute, G., et al. (2024). Driving and suppressing the human language network using large language models. *Nature Human Behaviour*, 8(3), 544-561. https://doi.org/10.1038/s41562-023-01783-7

Holroyd, C. B. (2024). The controllosphere: The neural origin of cognitive effort. *Psychological Review*.

Van Gelder, T. (1995). What might cognition be, if not computation? *Journal of Philosophy*, 92(7), 345-381. https://doi.org/10.2307/2940961

Kelso, J. A. S. (1995). *Dynamic Patterns: The Self-Organization of Brain and Behavior*. MIT Press. ISBN: 978-0-262-61131-2

Tognoli, E., & Kelso, J. A. S. (2014). The metastable brain. *Neuron*, 81(1), 35-48. https://doi.org/10.1016/j.neuron.2013.12.022

Thelen, E., & Smith, L. B. (1994). *A Dynamic Systems Approach to the Development of Cognition and Action*. MIT Press. ISBN: 978-0-262-70059-5

Kirkpatrick, S., Gelatt, C. D., & Vecchi, M. P. (1983). Optimization by simulated annealing. *Science*, 220(4598), 671-680. https://doi.org/10.1126/science.220.4598.671

Ogden, P., Minton, K., & Pain, C. (2006). *Trauma and the Body: A Sensorimotor Approach to Psychotherapy*. Norton. ISBN: 978-0-393-70457-0

Payne, P., Levine, P. A., & Crane-Godreau, M. A. (2015). Somatic experiencing: using interoception and proprioception as core elements of trauma therapy. *Frontiers in Psychology*, 6, 93. https://doi.org/10.3389/fpsyg.2015.00093

Porges, S. W. (2009). The polyvagal theory: New insights into adaptive reactions of the autonomic nervous system. *Cleveland Clinic Journal of Medicine*, 76(Suppl 2), S86-90. https://doi.org/10.3949/ccjm.76.s2.17

Levy, W. B., & Calvert, V. G. (2021). Communication consumes 35 times more energy than computation in the human cortex. *PNAS*, 118(18), e2008173118. https://doi.org/10.1073/pnas.2008173118

Parr, T., Da Costa, L., & Friston, K. (2020). Markov blankets, information geometry and stochastic thermodynamics. *Philosophical Transactions of the Royal Society A*, 378, 20190159. https://doi.org/10.1098/rsta.2019.0159

Schnall, S., Zadra, J. R., & Proffitt, D. R. (2010). Direct evidence for the economy of action: Glucose and the perception of geographical slant. *Perception*, 39, 464-482. https://doi.org/10.1068/p6445

Still, S., Sivak, D. A., Bell, A. J., & Crooks, G. E. (2012). Thermodynamics of prediction. *Physical Review Letters*, 109, 120604. https://doi.org/10.1103/PhysRevLett.109.120604

Carhart-Harris, R. L., & Friston, K. J. (2019). REBUS and the anarchic brain: Toward a unified model of the brain action of psychedelics. *Pharmacological Reviews*, 71(3), 316-344. https://doi.org/10.1124/pr.118.017160

