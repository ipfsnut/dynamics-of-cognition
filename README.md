# Dynamics of Cognition

An academic web application presenting theoretical research on embodied cognitive science, featuring an interactive paper format with optional beta demonstrations.

## Overview

This project presents original theoretical work on the **Configuration Constraint** — the claim that physiological configuration constrains the *set* of accessible cognitive states, not merely their probability. The application serves as both an academic paper and an interactive demonstration platform.

## Features

### Primary: Academic Paper View
- **Theoretical paper**: "Dynamics of Cognition: A Synthesis of Free Energy, Configuration Constraints, and Adaptive Systems"
- **Full bibliography** with DOI hyperlinks for journal articles and ISBN numbers for books
- **Mobile-optimized** responsive design
- **Academic formatting** following publication standards

### Secondary: Interactive Beta Mode
- **18+ interactive simulations** demonstrating key concepts:
  - Free Energy Principle landscapes
  - Markov Blanket dynamics
  - Configuration constraint visualization
  - Bioelectric morphogenesis
  - Controllosphere theory
  - And more...
- **Touch-optimized** controls for mobile interaction
- **Fullscreen support** for immersive exploration

## Architecture

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom cognitive science theme
- **Simulations**: Custom Canvas API implementations with Matter.js physics
- **Content**: Markdown-based with LaTeX math support
- **Knowledge Graph**: D3.js-powered vault visualization with wiki-link navigation
- **Deployment**: Netlify with Cloudflare Workers for authentication

### Content Sources
The application processes content from a private vault during build:
- **Vault Processing**: `./scripts/fetch-vault.sh` generates content from private repository
- **Graph Visualization**: Interactive knowledge graph with 40+ interconnected notes
- **Demo Integration**: Bidirectional linking between theory and interactive demonstrations

⚠️ **Important**: Build artifacts (paper.md, vault-manifest.json, etc.) are auto-generated and should never be committed to version control.

### Future: RAG Integration
The vault content provides an ideal knowledge base for Retrieval-Augmented Generation:
- **Rich theoretical content**: 40+ notes, 26k+ words across multiple domains
- **Structured metadata**: Titles, excerpts, links, backlinks, folder categorization
- **Demo connections**: Bidirectional links between theory and interactive simulations
- **Privacy-ready**: Password-protected access model ready for AI integration

See `docs/RAG_SETUP.md` for implementation roadmap.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── simulations/     # Interactive demonstrations
│   └── ...
├── pages/              # Section-based page components
├── assets/             # Compiled paper content
└── data/               # Navigation and reference data

public/                 # Static research documents
├── h-omega-synthesis.md      # Core theoretical framework
├── configuration-dynamics.md # Implementation details
└── thermodynamic-grounding.md # Physical foundations

scripts/
└── fetch-vault.sh      # Content compilation pipeline
```

## Key Theoretical Contributions

### H(ω) Framework
Formal synthesis connecting:
- **Coordination Dynamics** (Kelso's HKB model)
- **Predictive Processing** (Barrett's EPIC framework)  
- **Hierarchical RL** (Options framework)
- **Neural Implementation** (Controllosphere theory)

### The Configuration Constraint
**H(ω) = {h ∈ H : ω ∈ I_h}**

Where:
- **ω** = body configuration (autonomic state, metabolic reserves, etc.)
- **H** = space of interpretive/action mappings
- **I_h** = initiation set for mapping h
- **H(ω)** = accessible mappings given current configuration

### Core Insight
*"What cannot be configured cannot be thought"* — cognitive flexibility is bounded by physiological configuration, with implications for trauma therapy, expertise development, and human-machine interface design.

## Development

### Setup
```bash
npm install
npm run dev
```

### Content Pipeline
```bash
# Rebuild paper from vault source
npm run fetch-vault

# Deploy to production
npm run build
```

### Environment Variables
```bash
# Local vault path (development)
VAULT_SOURCE_LOCAL="/path/to/cognition-dynamics-vault"

# Cloudflare Workers (production)
VITE_AUTH_URL="https://your-worker.your-subdomain.workers.dev"
```

## Academic Context

This work synthesizes research across:
- **Embodied Cognition** (Varela, Thompson, Noë)
- **Predictive Processing** (Friston, Barrett, Hohwy)
- **Coordination Dynamics** (Kelso, Turvey)
- **Thermodynamic Cognition** (Still, Levy, Parr)
- **Clinical Applications** (van der Kolk, Porges, Ogden)

The application serves both as academic publication and research tool for exploring the intersections between cognitive science, dynamical systems theory, and embodiment.

## License

Research content © 2024 T. Dylan Daniel
Application code MIT License

## Citation

```
Daniel, T. D. (2024). Dynamics of Cognition: A Synthesis of Free Energy, 
Configuration Constraints, and Adaptive Systems. 
https://dynamics-of-cognition.netlify.app
```