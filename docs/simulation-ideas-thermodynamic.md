# Simulation Ideas: Thermodynamic Grounding of H(ω)

## Overview

These simulations aim to make the thermodynamic constraints on cognition visceral and intuitive. The goal is to show that H(ω) isn't just abstract mathematics—it's grounded in ATP budgets, metabolic costs, and the physics of maintaining far-from-equilibrium states.

---

## 1. MetabolicBudgetSim

**Concept:** Visualize why sparse coding is thermodynamic necessity, not design choice.

**Visual Design:**
- Grid of neurons (20×20 or so), each can be active (glowing) or inactive (dim)
- ATP meter prominently displayed (like a battery indicator)
- Each active neuron drains ATP at a visible rate
- User can click to activate neurons or use "dense pattern" / "sparse pattern" buttons

**Key Dynamics:**
- Dense activation (>10% of neurons) rapidly depletes ATP
- When ATP hits critical threshold, random neurons forcibly deactivate
- Sparse patterns (1-3% active) are sustainable indefinitely
- Recovery when activity drops: ATP slowly regenerates

**Educational Payoff:**
- Demonstrates the 1% concurrency limit empirically
- Shows sparse coding emerging from energy constraints
- "Aha moment": the brain isn't choosing to be sparse—it has to be

**Controls:**
- Activation density slider
- ATP regeneration rate
- Toggle "auto-homeostasis" (system self-regulates to sustainable levels)

---

## 2. EnergyAffordanceSim

**Concept:** Extension of CognitiveHorizonSim where the horizon contracts based on ATP levels, and different thoughts have different metabolic costs.

**Visual Design:**
- Central "self" with H(ω) horizon boundary
- Scattered thought nodes at various distances
- Each thought has a visible "cost" indicator (small, medium, large ATP symbols)
- ATP meter in corner
- Horizon radius is function of current ATP: radius = baseRadius × (ATP/maxATP)^0.5

**Key Dynamics:**
- High-cost thoughts (creative, abstract) require larger H(ω) radius to access
- As ATP depletes, horizon contracts
- Low-cost thoughts (habitual, immediate) remain accessible longer
- Rest/recovery expands horizon

**Educational Payoff:**
- Shows why exhaustion narrows thinking to immediate concerns
- Demonstrates metabolic prerequisites for affordances
- Makes "I can't think about that right now" literally visible

**Controls:**
- ATP depletion rate
- Activity level (higher = faster depletion)
- Rest mode (toggle to show recovery)
- Show/hide cost indicators

---

## 3. PredictionEfficiencySim

**Concept:** Visualize Still et al.'s finding—predictive models are thermodynamically efficient; storing nonpredictive information wastes energy.

**Visual Design:**
- Split view: "Predictive Agent" vs "Memorizing Agent"
- Both receive same stream of inputs (simple pattern with some randomness)
- Each agent has:
  - Memory storage (visualized as boxes/nodes)
  - Energy meter
  - Dissipation indicator (heat waves when wasting energy)

**Key Dynamics:**
- Predictive agent stores only information useful for prediction
- Memorizing agent stores everything indiscriminately  
- Same task performance initially
- Over time, memorizing agent's energy depletes faster
- Heat dissipation visualization shows "wasted" energy
- Eventually memorizing agent fails while predictive agent continues

**Educational Payoff:**
- Demonstrates why brains might be optimized for prediction
- Shows information-theoretic and thermodynamic efficiency are linked
- "Nostalgia" (irrelevant memory) has literal energy cost

**Controls:**
- Pattern complexity
- Memory capacity
- Toggle "show what's stored"
- Energy regeneration rate

---

## 4. CommunicationCostSim

**Concept:** Visualize the 35:1 communication-to-computation ratio.

**Visual Design:**
- Network of neurons with visible axonal connections
- Two energy meters: "Computation" (small) and "Communication" (large, ~35× size)
- Animated spikes traveling along axons
- Local computation shown as node glow

**Key Dynamics:**
- Each spike traveling along an axon visibly drains the Communication meter
- Local computation (node processing) drains the small Computation meter
- User can adjust network connectivity (sparse vs dense)
- Dense connectivity causes rapid Communication drain
- Sparse, local connectivity is sustainable

**Educational Payoff:**
- Demonstrates why brain organization is modular
- Shows wiring costs dominate
- Explains why "thinking hard" depletes energy even without motor output

**Controls:**
- Network density (sparse → dense)
- Firing rate
- Toggle "show energy flow"
- Compare local vs distributed processing

---

## 5. GlucosePerceptionSim

**Concept:** Based on Schnall et al.—demonstrate how metabolic state shapes affordance perception.

**Visual Design:**
- First-person view of a hill/incline
- Glucose meter (styled as blood sugar indicator)
- Steepness estimate display
- Hill rendered with adjustable visual angle

**Key Dynamics:**
- At high glucose: hill appears at true angle (e.g., 30°)
- As glucose depletes: perceived angle increases (e.g., 35°, 40°)
- Extreme depletion: hill looks nearly impassable
- "Drink glucose" button restores perception
- Same physical hill, different perceived affordance

**Educational Payoff:**
- Concrete demonstration of economy of action
- Shows perception isn't veridical—it's metabolically scaled
- Affordances literally depend on energy reserves

**Controls:**
- True hill angle
- Glucose level (manual or auto-depletion)
- Toggle "show true vs perceived"
- Activity mode (depletes glucose while watching)

---

## 6. ThermodynamicLandscapeSim

**Concept:** Configuration space as an energy landscape where different regions have different metabolic costs to occupy.

**Visual Design:**
- 3D surface visualization (like a height map)
- Ball representing current configuration
- Color coding: blue = low metabolic cost (valleys), red = high cost (peaks)
- ATP meter
- Controllosphere regions marked

**Key Dynamics:**
- Ball naturally rolls toward low-cost attractors (intrinsic manifold)
- User can "push" ball uphill with effort (costs ATP)
- Releasing effort → ball rolls back down
- Sustained high-cost position requires continuous ATP expenditure
- ATP depletion → forced return to valley

**Educational Payoff:**
- Visual metaphor for intrinsic manifold vs controllosphere
- Shows why effortful cognition is literally uphill
- Demonstrates fatigue as inability to maintain costly positions

**Controls:**
- Landscape complexity
- "Effort" application (mouse drag or slider)
- ATP regeneration rate
- Toggle "show cost gradient"

---

## Implementation Priority

Based on impact and feasibility:

1. **EnergyAffordanceSim** - Directly extends existing CognitiveHorizonSim, maximum conceptual payoff
2. **MetabolicBudgetSim** - Simple, visceral, demonstrates core constraint
3. **ThermodynamicLandscapeSim** - Beautiful visualization of controllosphere grounding
4. **PredictionEfficiencySim** - Novel insight (Still et al.), connects to FEP
5. **GlucosePerceptionSim** - Empirically grounded, connects to ecological psychology
6. **CommunicationCostSim** - Important but more complex, network visualization challenges

---

## Technical Notes

- All sims should share the CollapsiblePanel component for mobile
- ATP meters should have consistent visual language across sims
- Consider shared utility functions for energy dynamics
- Color schemes: blue/green = sustainable, yellow/red = costly, gray = depleted
- Smooth animations essential for "aha moments"—jerky transitions undermine intuition
