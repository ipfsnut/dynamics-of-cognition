# Configuration-Dependent Cognitive Accessibility: A Formal Framework for Energy-Constrained Cognition

## Paper Structure (Draft)

---

## Abstract

We present H(ω), a formal framework for modeling how bodily configuration constrains cognitive accessibility. Unlike precision-weighting models that treat physiological state as continuously modulating all cognitive operations, H(ω) formalizes categorical accessibility: certain cognitive operations become *impossible* (not merely improbable) outside their initiation sets in configuration space. We ground this framework in thermodynamic reality—the brain's 20% metabolic demand, mitochondrial ATP production, and peripheral-central immune signaling—and demonstrate its application to three clinical conditions: chemotherapy-related cognitive impairment (chemo brain), myalgic encephalomyelitis/chronic fatigue syndrome (ME/CFS), and Long COVID. The framework explains previously puzzling phenomena: why patients report categorical incapacity ("I can't think") rather than gradual degradation; why post-exertional malaise shows delayed onset and hysteresis; why standard neuropsychological tests fail to capture experienced impairment; and why patients confabulate stimulus-focused explanations ("this idea is unreasonable") for configuration-dependent constraints. We provide a computational model demonstrating key predictions and discuss implications for clinical assessment and intervention.

---

## 1. Introduction: The Problem of Categorical Incapacity

### 1.1 The Clinical Puzzle

Patients with CRCI, ME/CFS, and Long COVID consistently describe their cognitive impairment in categorical terms:
- "I *can't* think" (not "thinking is harder")
- "My brain just *won't*" (not "my brain is slower")
- "Crash," "collapse," "shutdown" (not "fatigue," "tiredness")

This language is systematically dismissed. Standard cognitive models predict gradual degradation under resource constraint—slower processing, more errors, reduced capacity. They don't predict categorical unavailability. Yet phenomenological studies consistently reveal patients describing experiences that sound categorical.

### 1.2 The Assessment Crisis

Only ~33% of studies find correlations between objective neuropsychological tests and subjective patient complaints. This creates two interpretive options:
1. Patients are systematically wrong about their own cognition
2. Tests are measuring the wrong thing

Neuroimaging evidence supports option 2: patients show *compensatory activation*—recruiting additional brain regions to maintain performance. Tests measure output; they miss cost. Patients accurately perceive that something has changed; tests fail to capture what.

### 1.3 Theoretical Contribution

We propose that existing frameworks are missing a level of analysis. Current models treat physiological state as modulating:
- Precision (predictive processing)
- Gain (neural networks)  
- Utility (decision theory)
- Drift rate (accumulator models)

All of these are *continuous* modulations. We propose that physiological state also determines *categorical accessibility*: which operations can run at all. This is the H(ω) framework.

---

## 2. The H(ω) Framework

### 2.1 Core Formalization

**Definition 1 (Configuration Space)**: Ω is the space of possible body configurations, parameterized by physiological variables including:
- E: effective energy (ATP availability, glucose, mitochondrial function)
- I: inflammatory load (cytokine levels, neuroinflammation)
- A: arousal/stress (HPA axis activation, sympathetic tone)
- Additional slow variables: sleep debt, allostatic load, recovery capacity

**Definition 2 (Operation Space)**: H is the set of cognitive operations available to the agent, including:
- Hardwired networks (innate perceptual-motor couplings)
- Learned networks (consolidated skills, habits)
- Construction machinery (capacity to build novel couplings)

**Definition 3 (Initiation Set)**: Each operation h ∈ H has an initiation set I_h ⊆ Ω specifying the configurations from which it can run.

**Definition 4 (Accessible Set)**: H(ω) = {h ∈ H : ω ∈ I_h} is the set of operations accessible from configuration ω.

**Key Claim**: H(ω) defines categorical accessibility. When ω ∉ I_h, operation h is *unavailable*—not merely down-weighted, but impossible to execute.

### 2.2 Distinction from Precision-Weighting

| Precision-weighting | H(ω) |
|---------------------|------|
| All operations always available | Operations categorically accessible or not |
| State affects confidence/gain | State affects existence in choice set |
| Continuous modulation: π(ω) ∈ [0,1] | Categorical gating: h ∈ H(ω) or h ∉ H(ω) |
| Radio at low volume | Radio outside frequency range |

This isn't anti-precision-weighting—precision likely modulates operations *within* H(ω). But it can't modulate what isn't there.

### 2.3 The Two-Level Architecture

**Level 1: Hardwired Networks**
- Cheap to run (low metabolic cost)
- Specific initiation sets (some require minimal energy, others require more)
- Examples: threat-avoidance, food-approach, basic social responses

**Level 2: Construction Machinery**
- Expensive to run (high metabolic cost)
- Narrow initiation set (requires energy > threshold, arousal < threshold, inflammation < threshold)
- Function: builds novel couplings, handles complexity, creates new Level 1 networks through consolidation

**Critical insight**: When construction machinery goes offline, the agent can only respond with existing hardwired networks. Novel stimuli that require construction produce *aversion*—the threat system activates because demands exceed available resources.

### 2.4 The Aversion System

When a stimulus requires an operation h where ω ∉ I_h:
1. No appropriate network can run
2. The system doesn't simply fail silently
3. Threat-detection activates (amygdala fires)
4. Available defensive responses execute (withdraw, avoid, reject, snap)
5. The agent experiences genuine aversion

**The phenomenology is real but the attribution is confabulated**: The agent has no introspective access to "my construction machinery is offline." They only see the output (irritation) and confabulate a cause ("this idea is unreasonable," "this is too much").

### 2.5 Relationship to Active Inference

Active inference provides the most comprehensive current framework for understanding perception, action, and cognition as unified processes of free energy minimization (Friston, 2010; Parr, Pezzulo & Friston, 2022). H(ω) is not a replacement for active inference but an extension that adds a layer of analysis active inference currently lacks: **categorical constraints on which policies can be entertained**.

**What active inference provides**:
- Generative model: The brain maintains a probabilistic model of how hidden states cause observations
- Free energy minimization: Perception updates beliefs; action changes the world
- Precision-weighting: Confidence modulates how much weight signals receive
- Expected free energy: Policies selected by balancing epistemic and pragmatic value
- Interoceptive inference: The body is part of what the brain models

**What active inference doesn't address**: In standard formulations, all policies remain in the policy space. Physiological state affects precision, not existence. There's no formal distinction between "this policy is down-weighted" and "this policy cannot be constructed."

**H(ω) as extension**: The key addition is that the policy space itself becomes configuration-dependent:

Standard active inference:
```
Policies → Expected Free Energy → Selection (all policies available)
```

With H(ω):
```
Configuration ω → H(ω) → Available Policies → Expected Free Energy → Selection
```

Formally, let Π denote the set of policies. In standard active inference, P(π) ∝ exp(-G(π)) where G is expected free energy, and all π ∈ Π compete. With H(ω):

```
Π(ω) = {π : all operations required by π are in H(ω)}
P(π | ω) ∝ exp(-G(π))  for π ∈ Π(ω)
P(π | ω) = 0           for π ∉ Π(ω)
```

This is a **hard constraint**, not a soft prior. Policies requiring inaccessible operations have zero probability regardless of their expected free energy.

**Precision vs. Accessibility**: These are complementary mechanisms:

| Aspect | Precision-weighting | H(ω) accessibility |
|--------|--------------------|--------------------|
| Nature | Continuous modulation | Categorical gating |
| Mechanism | Gain on signals | Availability of operations |
| Range | (0, ∞) | {0, 1} |
| Analogy | Volume knob | Power switch |

Both are necessary. Precision explains why we attend more to some signals. H(ω) explains why some responses aren't available at any attentional setting.

**Connection to allostatic self-efficacy**: Stephan et al. (2016) introduced "allostatic self-efficacy"—the agent's confidence in its ability to maintain homeostasis. H(ω) grounds this concept: high allostatic self-efficacy = belief that ω can be maintained in regions where H(ω) is large. An agent with accurate self-efficacy calibrates policies to actual H(ω). Miscalibration produces either overreach (attempting inaccessible operations → aversion) or unnecessary restriction (avoiding accessible operations → appearing "unmotivated").

---

## 3. Grounding in Metabolic Reality

### 3.1 The Brain's Energy Constraint

The brain constitutes ~2% of body weight but consumes ~20% of glucose-derived energy. It maintains minimal reserves. Any systemic disruption to energy availability disproportionately affects cognitive function.

### 3.2 Mitochondrial Dysfunction as the Common Substrate

Across CRCI, ME/CFS, and Long COVID:
- Reduced ATP production documented
- Impaired pyruvate dehydrogenase (PDH) function
- Shift from oxidative phosphorylation to less efficient glycolysis
- WASF3 protein elevation interfering with mitochondrial complex assembly
- Oxidative stress creating feedback loops

These aren't three separate pathologies—they're three manifestations of the same underlying constraint: insufficient energy for expensive operations.

### 3.3 Inflammation as Hidden Tax

Inflammatory cytokines (IL-6, TNF-α) signal the CNS via humoral and neural pathways. Inflammation:
- Reduces effective energy availability
- Narrows initiation sets for construction machinery
- Activates sickness behavior (withdrawal, conservation)

The patient with E=0.5 and I=0.4 has effective energy of ~0.38. The inflammation is "invisible" to phenomenology but constrains H(ω).

---

## 4. Clinical Manifestations

### 4.1 Chemotherapy-Related Cognitive Impairment

**Configuration profile**: Low energy, elevated inflammation, variable arousal

**Characteristic phenomena**:
- Novel ideas trigger aversion, not engagement
- Complexity becomes aversive (multitasking avoided)
- Patients report "emotional chemobrain"—irritability, reactivity
- Misattribution: "this idea is unreasonable" vs. "my construction machinery is offline"

**H(ω) explanation**: Construction machinery offline due to E_eff < threshold. Novel/complex stimuli have no matching hardwired network → aversion system activates → confabulated attribution to stimulus properties.

### 4.2 Myalgic Encephalomyelitis/Chronic Fatigue Syndrome

**Configuration profile**: Impaired energy regeneration, post-exertional collapse, hysteresis

**Characteristic phenomena**:
- Post-exertional malaise (PEM): "crash" 12-48 hours after exertion
- Physical AND cognitive exertion both trigger PEM
- Push-crash cycle: feel better → do too much → collapse → slow recovery
- "Crash," "collapse" language (categorical, not continuous)

**H(ω) explanation**: 
- Exertion depletes E faster than it regenerates (mitochondrial dysfunction)
- When E crosses threshold, H(ω) contracts categorically
- Delayed onset reflects slow variable dynamics
- Hysteresis: I_h threshold for losing access ≠ threshold for regaining it
- Push-crash = overestimating current H(ω), exceeding energy budget

### 4.3 Long COVID

**Configuration profile**: Persistent inflammation, variable energy, overlapping with ME/CFS in 58% of cases

**Characteristic phenomena**:
- Brain fog: "sluggish," "fuzzy," "cloudy" thinking
- Fluctuating/unpredictable symptoms
- Difficulty with multitasking specifically
- Post-exertional symptom exacerbation

**H(ω) explanation**: Chronic inflammation maintains elevated I, reducing E_eff. Construction machinery chronically constrained. Good days = configuration temporarily in wider initiation sets. Bad days = configuration contracts H(ω).

---

## 5. Predictions That Distinguish H(ω) from Alternatives

### 5.1 Forcing Blocked Operations

**Precision-weighting predicts**: If you force the operation (high enough incentive), performance will be slow/noisy but possible.

**H(ω) predicts**: If ω ∉ I_h, forcing produces failure/freeze/aversion, not eventual success. The operation isn't available at any price.

**Testable**: Vary incentives for complex tasks under depletion. H(ω) predicts a threshold below which incentives have no effect.

### 5.2 Hysteresis in Recovery

**Standard models predict**: Recovery should mirror depletion (symmetric).

**H(ω) predicts**: Hysteresis—harder to regain access than to lose it. The "return threshold" for I_h is higher than the "loss threshold."

**Testable**: Track H(ω) during depletion and recovery. Should see asymmetric trajectories.

### 5.3 Expertise as Widened Initiation Sets

**Standard models predict**: Experts are faster/more accurate.

**H(ω) predicts**: Experts maintain access to operations under conditions where novices lose access. Same operation, different I_h.

**Testable**: Compare expert/novice performance under depletion. H(ω) predicts divergence increases as resources drop.

### 5.4 Categorical Cliff vs. Gradual Degradation

**Standard models predict**: Continuous degradation function.

**H(ω) predicts**: Sudden transitions when configuration crosses initiation set boundaries.

**Testable**: Fine-grained tracking of performance across metabolic manipulation. H(ω) predicts non-linearities at specific thresholds.

---

## 6. The Phenomenology Problem

### 6.1 Bankrupt Phenomenology

Patients lack introspective access to their configuration. They cannot perceive:
- "My ATP is low"
- "My inflammatory load is high"
- "Construction machinery is offline"

They CAN perceive:
- "I feel irritated"
- "This seems unreasonable"
- "I can't deal with this"

### 6.2 Confabulated Attribution

The aversion is real (amygdala fires, threat system activates). But the attribution is constructed post-hoc:
- "This idea is intrusive" (attributed to stimulus)
- "I don't have patience for this" (attributed to preference)
- "They're being inconsiderate" (attributed to other's behavior)

None of these identify the actual cause: configuration constraint on H(ω).

### 6.3 Clinical Implications

Healthcare providers interpret patient reports through the confabulated frame:
- "Patient is being difficult"
- "Patient has attitude problem"
- "Patient is anxious/depressed"

The H(ω) frame suggests reinterpretation:
- Patient's construction machinery is offline
- Aversion is the expected response to demands that exceed H(ω)
- The misattribution is a feature, not a bug—phenomenology doesn't have access to configuration

---

## 7. Computational Model

### 7.1 Purpose and Scope

We provide a computational model to demonstrate the logical structure of the H(ω) framework. The model is *illustrative*, not *fitted*: parameter values are chosen to produce qualitatively correct behavior, not derived from empirical data. The goal is to show that *if* the mechanisms we propose exist, *then* the phenomena we describe follow necessarily.

This is a "how possibly" explanation in Craver's (2007) taxonomy—demonstrating that a mechanism of this form could produce the target phenomena—rather than a "how actually" explanation requiring quantitative fit to data. The model serves three functions:

1. **Logical demonstration**: Shows that categorical accessibility, hysteresis, and confabulated attribution follow from the formal framework
2. **Intuition building**: Makes abstract concepts concrete through simulation
3. **Prediction generation**: Produces specific patterns that distinguish H(ω) from alternative models

### 7.2 Architecture

**Configuration Space**: Configuration ω is represented as a vector with different timescales:
- *Fast* (seconds–minutes): Arousal
- *Medium* (hours): Energy, acute inflammation
- *Slow* (days–weeks): Energy capacity, recovery rate, inflammation baseline

The key derived quantity is **effective energy**: E_eff = E - (I × 0.4). Inflammation imposes a "hidden tax"—metabolic resources diverted to immune function are unavailable for cognition.

**Operations and Initiation Sets**: Each operation h has an initiation set defined by boundaries:

| Type | Examples | E_eff threshold | I threshold |
|------|----------|-----------------|-------------|
| Hardwired Simple | Rest, threat-avoid | 0.0–0.15 | 1.0 |
| Hardwired Complex | Planning, multitasking | 0.25–0.30 | 0.6–1.0 |
| Construction | Novel problem-solving, creative | 0.32–0.38 | 0.45–0.55 |

**Hysteresis**: Initiation sets exhibit asymmetric thresholds. An operation lost at E_eff = 0.35 is not regained until E_eff = 0.40 (margin = 0.05). Getting worse is easier than getting better.

**Clinical Phenotypes**: Four configurations model different conditions:
- *Healthy*: E_eff = 0.88; all operations accessible
- *Chemo Brain*: E_eff = 0.17; construction inaccessible
- *ME/CFS*: E_eff = 0.42 at baseline; catastrophic post-exertional collapse
- *Long COVID*: E_eff = 0.41; fluctuating, construction marginal

**Post-Exertional Malaise**: For ME/CFS modeling, exertion creates delayed consequences: immediate cost (50%) plus debt accumulation (50%) that "comes due" after delay, producing the characteristic pattern of delayed collapse.

**Aversion System**: When required operation h is inaccessible and no fallback suffices, the aversion system activates with operation-specific confabulated attributions ("This is unreasonable," "They don't understand what they're asking").

### 7.3 Demonstrations

**Demonstration 1: Same Stimulus, Different Bodies**

Present novel idea (requiring `novel_problem`) to four phenotypes:

| Phenotype | E_eff | H(ω) | Response | Attribution |
|-----------|-------|------|----------|-------------|
| Healthy | 0.88 | 13/13 | SUCCESS | "Engaging with novel idea" |
| Chemo Brain | 0.17 | 3/13 | FALLBACK | "Doing what I can" |
| ME/CFS | 0.42 | 12/13 | SUCCESS | "Engaging with novel idea" |
| Long COVID | 0.41 | 12/13 | SUCCESS | "Engaging with novel idea" |

The chemo brain agent cannot engage with the novel idea (construction machinery offline) but *can* apply a familiar routine—hence fallback rather than pure aversion. This distinction matters clinically: fallback produces partial engagement with awareness of inadequacy ("I'm not really handling this"), while aversion produces rejection with stimulus-blaming attribution ("this is unreasonable").

**Demonstration 2: A Day in ME/CFS**

Morning (E_eff ≈ 0.50): Chat → SUCCESS, Email → SUCCESS, Planning → SUCCESS, Novel idea → SUCCESS (high cost)

Afternoon (E_eff ≈ 0.25, debt accumulating): Multitasking → FALLBACK, Creative → FALLBACK

Evening (debt comes due, E_eff ≈ 0.20): H(ω) contracted to 5 operations

Next day (E_eff ≈ 0.20): Still restricted, slowly recovering

The morning looked normal but accumulated unsustainable costs. Crash is delayed, recovery slower than depletion.

**Demonstration 3: Hysteresis Loop**

Track `novel_problem` (threshold = 0.35) through depletion and recovery:
- Lost access at E_eff = 0.34
- Still inaccessible at E_eff = 0.35, 0.38
- Regained at E_eff = 0.40

Access lost at 0.35, regained at 0.40. Asymmetric dynamics.

**Demonstration 4: Confabulated Attribution**

Same stimulus (novel idea) presented at progressively deteriorating configurations:

| Configuration | E_eff | H(ω) | Response | Attribution |
|---------------|-------|------|----------|-------------|
| Rested | 0.78 | 13/13 | SUCCESS | "Engaging with novel idea" |
| Mildly depleted | 0.34 | 8/13 | FALLBACK | "Doing what I can" |
| Significantly depleted | 0.10 | 3/13 | FALLBACK | "Doing what I can" |
| Severely depleted | 0.00 | 0/13 | AVERSION | "Why are they bringing this up?" |

As configuration deteriorates, response type shifts: SUCCESS (full engagement) → FALLBACK (substitute simpler operation, aware of inadequacy) → AVERSION (reject stimulus, blame stimulus properties). The confabulated attribution emerges at the AVERSION stage—the agent attributes rejection to stimulus properties ("unreasonable," "why now?") rather than to configuration constraint ("construction machinery offline").

### 7.4 Model Predictions

The model generates predictions distinguishing H(ω) from continuous-modulation alternatives:

**Prediction 1: Bimodal Performance at Boundaries**

Near initiation set thresholds, performance should be bimodal (success or failure), not normally distributed around a degraded mean. Test: measure construction task performance across metabolic states.

**Prediction 2: Incentive Insensitivity Below Threshold**

Below thresholds, increasing incentives should not improve performance. Continuous models predict monotonic improvement with incentive. Test: vary rewards under depletion.

**Prediction 3: Asymmetric Recovery**

Recovery should show hysteresis—returning to baseline configuration doesn't immediately restore function. Test: deplete then restore; track lag between metabolic normalization and performance recovery.

**Prediction 4: Operation-Specific Vulnerability**

Different operations should fail at different thresholds, not uniform degradation. Test: task battery spanning types under manipulation; construction should fail first.

### 7.5 Limitations

The model is deliberately simplified: parameter values are illustrative not fitted; operations are discrete; configuration space is low-dimensional; individual differences not modeled; learning not implemented. These limitations are appropriate for a framework-introducing paper; quantitative fitting awaits empirical studies.

---

## 8. Implications and Future Directions

### 8.1 Clinical Assessment

Current tests measure capacity; H(ω) suggests measuring accessibility:
- Test same operations across different metabolic states
- Look for categorical transitions, not just continuous degradation
- Develop assessments sensitive to construction vs. hardwired operations

### 8.2 Intervention Design

If the problem is configuration-dependent accessibility:
- Interventions that change ω (metabolic support, inflammation reduction) should expand H(ω)
- Pacing strategies prevent configuration from exiting initiation sets
- Environment design can reduce demands on construction machinery

### 8.3 Destigmatization

The H(ω) framework reframes "laziness," "attitude," "difficulty" as:
- Rational responses to configuration constraints
- Expected phenomenology when H(ω) is narrow
- Not character flaws but thermodynamic realities

### 8.4 Open Questions

1. How to measure initiation sets empirically?
2. What determines initiation set boundaries?
3. How do initiation sets change with training/expertise?
4. Network composition: how do operations combine?
5. Individual differences in initiation set geometry

---

## 9. Conclusion

Cognition is configuration-dependent. The set of available cognitive operations—not just their precision or speed—depends on the body's thermodynamic state. This isn't metaphorical: the brain runs on ATP, inflammation signals the CNS, and mitochondrial dysfunction measurably constrains cognitive function. The H(ω) framework formalizes this dependency, explains clinical phenomena that existing models miss, generates testable predictions, and suggests new approaches to assessment and intervention. The angry chemo patient isn't choosing to be difficult; their construction machinery is offline, and aversion is what remains when you subtract the operations that require energy they don't have.

---

## Key References to Include

**Metabolic constraints on cognition**:
- Laughlin & Attwell (foundational neural energy work)
- Sengupta, Stemmler & Friston (thermodynamic free energy)
- Christie & Schrater (cognitive cost as energy allocation)

**Clinical phenomenology**:
- Henderson et al. (chemo brain qualitative)
- Stussman et al. (ME/CFS PEM characterization)
- Callan et al. (Long COVID cognitive experience)

**Mechanisms**:
- Baudino et al. (brain glucose metabolism in chemo)
- Myhill et al. (ATP profile in ME/CFS)
- WASF3 discovery (mitochondrial interference)
- Kepecs et al. (inflammation-motivation circuit)

**Assessment gap**:
- Hutchinson (subjective-objective discrepancy review)
- Cancer Neuroscience Initiative Working Group (test inadequacy)
- Bernstein et al. (compensatory activation meta-analysis)

**Gating mechanisms**:
- Frank, Loughry & O'Reilly (basal ganglia gating)
- Braver (dual mechanisms of control)

**Active inference**:
- Friston (2010) (free-energy principle)
- Parr, Pezzulo & Friston (2022) (Active Inference textbook)
- Craver (2007) (mechanistic explanation taxonomy)

**Interoceptive inference**:
- Seth (interoceptive predictive coding)
- Barrett (constructed emotion)
- Stephan et al. (2016) (allostatic self-efficacy)

---

## Figures Needed

1. **Configuration space diagram**: Ω with regions marked for different H(ω) sizes
2. **Initiation set visualization**: Operations with their I_h boundaries
3. **Clinical trajectory comparison**: Chemo brain, ME/CFS, Long COVID as different paths through Ω
4. **The aversion system**: Flowchart from stimulus → no matching network → threat activation → confabulated attribution
5. **Model output**: Screenshots/plots from computational demonstration
6. **Predictions comparison**: H(ω) vs. precision-weighting vs. EVC predictions for test cases

---

## Word Count Estimate

- Abstract: 250
- Introduction: 1500
- Framework (incl. active inference connection): 3500
- Metabolic grounding: 1500
- Clinical manifestations: 2000
- Predictions: 1500
- Phenomenology: 1000
- Computational model: 2000
- Implications: 1000
- Conclusion: 500

**Total: ~14,750 words** (appropriate for theoretical paper in Neuroscience & Biobehavioral Reviews, Physics of Life Reviews, or similar)

---

## Target Venues

**Primary targets** (theoretical neuroscience/cognitive science):
- Neuroscience & Biobehavioral Reviews
- Physics of Life Reviews
- Behavioral and Brain Sciences (with commentaries)
- Philosophical Psychology

**Secondary targets** (computational):
- PLOS Computational Biology
- Neural Computation
- Frontiers in Computational Neuroscience

**Clinical impact**:
- Brain, Behavior, and Immunity
- Journal of Psychosomatic Research
