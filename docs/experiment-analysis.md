# H(ω) Computational Experiments: Analysis

## The Key Insight

Both experiments demonstrate the same fundamental property: **systems that cannot hallucinate**.

When an LLM lacks the capacity to solve a problem, it produces a confident wrong answer. When these systems lack capacity, they produce *nothing*—or at least, nothing that claims to be a solution.

This maps directly to the H(ω) framework's core claim: cognitive operations are **categorically accessible** (present or absent), not continuously degraded.

---

## Experiment 1: Game of Life with Energy Costs

### System Properties
- **Substrate**: 2D cellular automaton
- **Operations**: Patterns (still lifes, oscillators, spaceships, guns)
- **Resource**: Energy pool depleted by cell state changes
- **Failure mode**: Dynamics freeze when energy insufficient

### Key Results

| Pattern | Type | Energy Cost/Step | Threshold |
|---------|------|------------------|-----------|
| Block | Still life | 0 | ~0 |
| Blinker | Oscillator | ~3 | 3.1 |
| Glider | Spaceship | ~3 | 3.1 |
| Toad | Oscillator | ~7 | 7.2 |
| LWSS | Spaceship | ~10 | 10.2 |

### H(ω) Signatures Demonstrated

1. **Categorical collapse**: Glider either propagates or freezes. No "slow glider."

2. **Complexity hierarchy**: Complex patterns (LWSS > Toad > Glider > Block) have higher thresholds.

3. **Hysteresis**: Pattern froze at energy ~5, but required ~20 to restart. This is because:
   - Sustaining a running pattern: energy covers incremental changes
   - Restarting a frozen pattern: energy must cover re-establishing coherent dynamics

4. **No hallucination**: A frozen grid doesn't "approximately glide." The pattern is either there or not.

### Mapping to H(ω)

| GoL Concept | H(ω) Concept |
|-------------|--------------|
| Energy pool | Effective energy E_eff |
| Pattern | Cognitive operation h |
| Min energy to sustain | Initiation set boundary |
| Frozen state | Operation inaccessible |
| Pattern complexity | Construction vs. hardwired |

---

## Experiment 2: Constraint Satisfaction with Limited Working Memory

### System Properties
- **Substrate**: Variable assignments
- **Operations**: Problem-solving (finding valid assignments)
- **Resource**: Working memory (how many variables can be held), operations budget
- **Failure mode**: Returns FAILURE, not wrong answer

### Key Results

| Problem | Variables | Constraints | Min Memory |
|---------|-----------|-------------|------------|
| Simple Assignment | 5 | 0 | 5 |
| Chain Ordering | 5 | 4 | 5 |
| Graph Coloring | 5 | 5 | 5 |
| 4-Queens | 4 | 12 | 4 |
| 5-Queens | 5 | 20 | 5 |
| 6-Queens | 6 | 30 | 6 |
| Mini-Sudoku | 16 | ~80 | 16 |

### H(ω) Signatures Demonstrated

1. **Categorical failure**: Solver returns valid solution OR specific failure mode (memory_exceeded, budget_exhausted, no_solution). Never a wrong solution.

2. **Multiple resource dimensions**: 
   - Memory capacity (can you hold the partial solution?)
   - Stack depth (can you backtrack far enough?)
   - Operations budget (do you have time to search?)
   
   Different constraints → different failure modes.

3. **Complexity hierarchy**: Problems requiring more variables need more memory.

4. **Hysteresis**: Finding a solution costs ~315 operations. Verifying one costs ~20 (just check constraints). This means:
   - "Losing" capability (forgetting a solution) is easy
   - "Regaining" capability (re-deriving it) requires full search

5. **Progressive collapse**: As memory decreases (8→7→6→5→4→3), problems drop out of solvability one by one, complex first.

### Mapping to H(ω)

| CSP Concept | H(ω) Concept |
|-------------|--------------|
| Working memory capacity | Effective energy E_eff |
| Problem type | Operation h |
| Min memory to solve | Initiation set boundary |
| FAILURE result | Operation inaccessible, aversion |
| Multiple resource types | Configuration space dimensionality |

---

## Why These Systems Work (And LLMs Don't)

### The Hallucination Problem

LLMs fail in a fundamentally different way:
- Insufficient capacity → confident wrong answer
- No metacognitive "I can't do this" signal
- Output always produced, regardless of actual capability

This makes LLMs poor testbeds for H(ω) because the failure mode is wrong.

### What These Systems Have

1. **Ground truth criterion**: Solution either satisfies constraints or doesn't
2. **No fabrication**: System can't "make up" a valid pattern/solution
3. **Resource-gated operations**: Operations require resources to execute
4. **Explicit failure**: System reports when it cannot proceed

These properties match the H(ω) framework:
- Operations have initiation sets (resource requirements)
- Outside initiation set → operation unavailable (not degraded)
- System "knows" (in functional sense) when operation unavailable

---

## Predictions Validated

| H(ω) Prediction | GoL Result | CSP Result |
|-----------------|------------|------------|
| Categorical (not gradual) failure | ✓ Pattern works or freezes | ✓ Solves or fails |
| Complex operations fail first | ✓ LWSS before Block | ✓ 6-Queens before 4-Queens |
| Hysteresis in recovery | ✓ Restart > sustain | ✓ Find > verify |
| Operation-specific thresholds | ✓ Each pattern has min energy | ✓ Each problem has min memory |
| No hallucination | ✓ Frozen ≠ degraded | ✓ Failure ≠ wrong answer |

---

## Implications for Clinical Understanding

These computational demonstrations show that H(ω) phenomena aren't exotic—they emerge naturally in any resource-constrained system with categorical success criteria.

The ME/CFS patient who says "I can't think" may be accurately reporting that a cognitive operation is **unavailable**, not merely **difficult**. Just as:
- A glider cannot "approximately propagate" without energy
- A solver cannot "approximately solve" without memory

The brain cannot "approximately construct novel couplings" without sufficient metabolic resources. The operation either runs or it doesn't.

---

## Future Directions

1. **Hybrid systems**: Can we build systems that have BOTH continuous degradation AND categorical failure? This would let us test whether H(ω) and precision-weighting make different predictions.

2. **Emergent complexity**: In the GoL, patterns like guns naturally require more energy. Can we show that "construction" operations naturally have narrower initiation sets than "hardwired" ones?

3. **Learning and adaptation**: How do initiation sets change with practice? A CSP solver with learning might expand its capability region over time.

4. **Multi-agent systems**: What happens when multiple agents share a resource pool? Does this create the "push-crash" dynamics seen in ME/CFS households?

---

## Running the Experiments

```bash
# Game of Life with Energy
python gol_energy.py

# Constraint Satisfaction with Memory Limits
python csp_memory.py
```

Both experiments are self-contained Python files with no dependencies beyond NumPy.
