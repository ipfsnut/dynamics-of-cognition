import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math, MathBlock } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { MarkovBlanketSim } from '../components/simulations/MarkovBlanketSim';
import { FreeEnergySim } from '../components/simulations/FreeEnergySim';
import VaultLinks from '../components/explorer/VaultLinks';

export function FreeEnergyPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          Karl Friston's Free Energy Principle (FEP), first comprehensively articulated 
          in his 2010 <em>Nature Reviews Neuroscience</em> paper, represents perhaps the 
          most ambitious attempt to derive cognitive phenomena from first principles 
          of physics. The framework begins with a deceptively simple observation: 
          any system that persists over time must resist the tendency toward 
          thermodynamic equilibrium, and this resistance can be formalized mathematically.
        </p>
      </Prose>

      <Subsection number="1.1" title="The Markov Blanket Formalism">
        <Prose>
          <p>
            The mathematical architecture rests on the <strong>Markov blanket</strong>—a 
            statistical boundary that separates internal states (<Math>{`\\mu`}</Math>) from 
            external states (<Math>{`\\psi`}</Math>) through sensory states (<Math>{`s`}</Math>) and 
            active states (<Math>{`a`}</Math>). The state partition is:
          </p>
        </Prose>

        <MathBlock>
          {`\\mathbf{x} = (\\psi, s, a, \\mu)`}
        </MathBlock>

        <Prose>
          <p>
            Where the blanket itself is <Math>{`b = (s, a)`}</Math>. The defining property 
            is <strong>conditional independence</strong>: internal states are conditionally 
            independent of external states given blanket states.
          </p>
        </Prose>

        <MathBlock>
          {`\\mu \\perp\\!\\!\\!\\perp \\psi \\mid b`}
        </MathBlock>

        <Prose>
          <p>
            This partition emerges naturally in random dynamical systems governed by 
            Langevin dynamics: <Math>{`dx/dt = f(x) + \\omega`}</Math>, where <Math>{`f(x)`}</Math> represents 
            deterministic flow and <Math>{`\\omega`}</Math> represents stochastic fluctuations.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Markov Blanket Dynamics"
          description="Physical membrane separating internal from external states. Drag particles to see the statistical boundary in action."
        >
          {({ width, height }) => (
            <MarkovBlanketSim width={width} height={height} />
          )}
        </SimulationCanvas>
      </Subsection>

      <Subsection number="1.2" title="Variational Free Energy">
        <Prose>
          <p>
            The central quantity is variational free energy (<Math>{`F`}</Math>), which 
            bounds surprisal from above:
          </p>
        </Prose>

        <MathBlock>
          {`F = -\\ln p(s) + D_{KL}[q(\\psi|\\mu) \\| p(\\psi|s)]`}
        </MathBlock>

        <Prose>
          <p>
            Systems minimize free energy through two complementary routes. <strong>Perceptual 
            inference</strong> updates internal states to minimize divergence between beliefs 
            and actual posteriors: <Math>{`\\dot{\\mu} = -\\partial F/\\partial \\mu`}</Math>. 
            <strong>Active inference</strong> changes sensory samples through action to confirm 
            predictions: <Math>{`\\dot{a} = -\\partial F/\\partial a`}</Math>.
          </p>
        </Prose>

        <KeyInsight>
          These are two routes to the same destination—keeping the system in probable states. 
          Any system that minimizes free energy will appear to perform approximate Bayesian 
          inference about the causes of its sensory states.
        </KeyInsight>

        <SimulationCanvas 
          title="Free Energy Landscape"
          description="Click anywhere to place a system—watch it minimize free energy by descending to attractor basins."
        >
          {({ width, height }) => (
            <FreeEnergySim width={width} height={height} />
          )}
        </SimulationCanvas>

        <Prose>
          <p>
            As Friston stated in his 2013 <em>Journal of the Royal Society Interface</em> paper: 
            biological self-organization is "an inevitable and emergent property of any (ergodic) 
            random dynamical system that possesses a Markov blanket." The claim that "to exist 
            is to infer" grounds cognition not in neural computation specifically but in the 
            fundamental physics of self-organizing systems.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="1.3" title="Addressing the Pearl/Friston Distinction">
        <Prose>
          <p>
            Critics have argued that a "persistent confusion" exists between the formal use of 
            Markov blankets as an epistemic tool for Bayesian inference (what Bruineberg et al. 
            2022 call "Pearl blankets") and their metaphysical use to demarcate physical 
            boundaries between agents and environments ("Friston blankets").
          </p>
          <p>
            This critique, while technically sophisticated, may assume a sharp map/territory 
            distinction that is precisely what FEP calls into question. The claim is not 
            "we can usefully model systems as having Markov blankets" but rather that any 
            system maintaining itself at non-equilibrium steady-state necessarily exhibits 
            the statistical structure that Markov blankets formalize.
          </p>
          <p>
            The genuine problem is not the statistical/metaphysical distinction but rather 
            the question of <em>which</em> Markov blanket partition is the correct one. Any 
            complex system admits multiple valid Markov blanket decompositions at different 
            scales and granularities. The formalism alone does not specify whether to draw 
            the blanket around a cell, an organ, an organism, or a social group. This is 
            the "boundary problem"—not whether blankets are real, but which blankets matter 
            for which explanatory purposes.
          </p>
        </Prose>
      </Subsection>

      <VaultLinks sectionSlug={section.slug} />
      
      <Bibliography referenceIds={section.references} />
      
      <PageNavigation 
        prevSection={prevSection}
        nextSection={nextSection}
        onNavigate={onNavigate}
      />
    </Section>
  );
}


