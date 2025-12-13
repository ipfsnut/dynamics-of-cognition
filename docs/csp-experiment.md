# CSP Experiment: Demonstrating Categorical Accessibility

## Overview

This document describes a computational demonstration of the H(ω) framework's core claim: that cognitive operations are **categorically accessible**—either available or not—rather than continuously degraded under resource constraint.

We use a **Constraint Satisfaction Problem (CSP) solver** with limited working memory as a testbed.

---

## The Key Property: No Hallucination

The critical difference between this testbed and, say, an LLM under resource constraint:

| System | Failure Mode | H(ω) Match? |
|--------|--------------|-------------|
| LLM with reduced context | Confident wrong answer | ✗ No |
| CSP with limited memory | Reports FAILURE | ✓ Yes |

LLMs fail by **hallucinating**—producing confident outputs regardless of actual capability. The CSP solver fails by **reporting failure**—it either returns a valid solution or explicitly states it cannot solve the problem.

This matches the H(ω) claim that operations are categorically accessible or not.

---

## The Mapping

| CSP Concept | H(ω) Concept |
|-------------|--------------|
| Working memory capacity | Configuration ω (specifically E_eff) |
| Problem type | Operation h |
| Minimum memory to solve | Initiation set boundary ∂I_h |
| SOLVED | h ∈ H(ω) — operation accessible |
| MEMORY_EXCEEDED | h ∉ H(ω) — categorical failure |

---

## Demonstrations

### 1. Categorical Failure

**Setup**: 6-Queens problem with capacity = 3

**Result**: MEMORY_EXCEEDED

**Interpretation**: h ∉ H(ω) — the operation is categorically inaccessible at this configuration. Not "solved poorly" or "partially solved" but **not solved**.

**Setup**: 6-Queens problem with capacity = 6

**Result**: SUCCESS with valid solution

**Interpretation**: h ∈ H(ω) — the operation is accessible.

### 2. Initiation Set Boundary

Running "Find I_h" on 5-Queens:

| ω (capacity) | Result |
|--------------|--------|
| 1 | ✗ |
| 2 | ✗ |
| 3 | ✗ |
| 4 | ✗ |
| 5 | ✓ |
| 6 | ✓ |

**Boundary**: I_h = {ω : capacity ≥ 5}

This is the initiation set made visible. Below the boundary, the operation is categorically inaccessible.

### 3. Complexity Hierarchy

Different problems have different initiation sets:

| Problem | I_h boundary |
|---------|--------------|
| Simple (3) | ω ≥ 3 |
| Chain (4) | ω ≥ 4 |
| 4-Queens | ω ≥ 4 |
| 5-Queens | ω ≥ 5 |
| 6-Queens | ω ≥ 6 |
| 7-Queens | ω ≥ 7 |

This demonstrates the complexity hierarchy claim: more complex operations have narrower (higher-threshold) initiation sets.

$$I_{\text{7-Queens}} \subset I_{\text{6-Queens}} \subset I_{\text{5-Queens}} \subset I_{\text{simple}}$$

---

## H(ω) Signatures Validated

| Prediction | CSP Result |
|------------|------------|
| Categorical (not gradual) failure | ✓ Solves or fails |
| Complex operations fail first | ✓ 7-Queens before 4-Queens |
| Operation-specific thresholds | ✓ Each problem has minimum capacity |
| No hallucination | ✓ Failure ≠ wrong answer |
| Bimodality at boundaries | ✓ At ω=5, 5-Queens either works or doesn't |

---

## Implications

The ME/CFS patient who says "I can't think" may be accurately reporting that a cognitive operation is **unavailable**, not merely **difficult**.

Just as:
- A CSP solver with capacity=3 **cannot** solve 6-Queens (not "solves it slowly")
- The operation is categorically inaccessible at that configuration

The brain with E_eff below threshold **cannot** run construction machinery:
- Not "thinks slowly"  
- Not "makes more errors"
- **Cannot run the operation at all**

The aversion the patient feels is the phenomenology of h ∉ H(ω).

---

## Running the Experiment

The CSP experiment is available as an interactive simulation: `CSPExperimentSim`

Key interactions:
1. Select a problem (operation h)
2. Adjust capacity (configuration ω)
3. Click "h ∈ H(ω)?" to test accessibility
4. Click "Find I_h" to discover the initiation set boundary

---

## References

- van Gelder, T. (1995). What Might Cognition Be, If Not Computation?
- Kelso, J.A.S. (1995). Dynamic Patterns: The Self-Organization of Brain and Behavior
- Sutton, Precup & Singh (1999). Between MDPs and Semi-MDPs: A Framework for Temporal Abstraction
- Holroyd, C.B. (2024). The Controllosphere
