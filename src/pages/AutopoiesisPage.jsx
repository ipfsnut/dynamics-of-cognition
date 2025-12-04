import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { AutopoiesisSim } from '../components/simulations/AutopoiesisSim';

export function AutopoiesisPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          The conceptual foundations for scale-free biological intelligence were established 
          decades before Friston's formalization, in the autopoiesis theory developed by 
          Humberto Maturana and Francisco Varela in 1970s Chile.
        </p>
        <p>
          An autopoietic system is defined as "a network of processes of production 
          (transformation and destruction) of components that: (i) recursively depend 
          on each other for their generation and their realization as a network, 
          (ii) constitute the system as a unity in whatever domain they exist, and 
          (iii) determine a domain of possible interactions with the environment."
        </p>
        <p>
          This definition anticipates the <Math>{`H(\\omega)`}</Math> formalization: the 
          system's self-production determines "a domain of possible interactions"—exactly 
          what <Math>{`H(\\omega)`}</Math> captures formally.
        </p>
      </Prose>

      <Subsection number="4.1" title="Operational Closure">
        <Prose>
          <p>
            The key innovation is recognizing that living systems are <strong>operationally 
            closed</strong>—internal processes form a self-referential network—while remaining 
            <strong>structurally coupled</strong> with their environment through matter and 
            energy exchange. The system produces the components that produce the system.
          </p>
          <p>
            This circular causality is not mystical but concrete: a cell membrane is 
            produced by processes that require a cell membrane to occur. The boundary 
            produces itself. In Markov blanket terms: the blanket states are maintained 
            by processes that depend on the blanket's integrity.
          </p>
          <p>
            The enactive approach to cognition extends autopoiesis to mind. Cognition is not 
            representing an independent external world but "bringing forth of an interdependent 
            world in and through embodied action." The world that matters to the organism is 
            the world specified by the organism's structure—its <Math>{`H(\\omega)`}</Math>.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Autopoietic System"
          description="Watch circular causality maintain the living boundary as the system self-produces."
        >
          {({ width, height }) => (
            <AutopoiesisSim width={width} height={height} />
          )}
        </SimulationCanvas>

        <KeyInsight>
          Friston explicitly connects autopoiesis to Markov blankets: simulations show 
          "oscillator death" occurring when blanket integrity fails—"a testament to autopoiesis." 
          Autonomous systems are hierarchically composed of Markov blankets of Markov blankets—all 
          the way down to individual cells, all the way up to you and me.
        </KeyInsight>
      </Subsection>

      <Subsection number="4.2" title="The Enactive Turn">
        <Prose>
          <p>
            The enactive approach, developed by Varela, Thompson, and Rosch in <em>The Embodied 
            Mind</em> (1991) and elaborated by Thompson in <em>Mind in Life</em> (2007), argues 
            that cognition is not the manipulation of abstract symbols but the ongoing 
            sense-making activity of an embodied agent.
          </p>
          <p>
            Key principles include:
          </p>
          <p>
            <strong>Autonomy:</strong> Living systems specify their own boundaries and 
            maintain themselves as distinct unities. This is the formal structure that 
            Markov blankets capture—but enactivism emphasizes that the boundary is 
            <em> self-specified</em>, not observer-imposed.
          </p>
          <p>
            <strong>Sense-making:</strong> Cognition is inherently evaluative—the world 
            matters to the organism in terms of its own viability. This is the origin of 
            normativity: good and bad, relevant and irrelevant, are defined relative to 
            the system's self-maintenance requirements.
          </p>
          <p>
            <strong>Emergence:</strong> Mind is not located in the head but arises from 
            the dynamic coupling between brain, body, and environment. The <Math>{`\\omega`}</Math> 
            in <Math>{`H(\\omega)`}</Math> is the whole coupled system, not just neural state.
          </p>
          <p>
            <strong>Experience:</strong> Phenomenal consciousness is not an epiphenomenon 
            but a constitutive feature of living systems. Where there is sense-making, 
            there is already something it is like to be that system.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="4.3" title="Thompson's Contribution">
        <Prose>
          <p>
            Evan Thompson's <em>Mind in Life</em> (2007) provides the most rigorous 
            philosophical development of enactivism. His central argument: the hard 
            problem of consciousness presupposes an explanatory gap between "physical" 
            and "experiential" that autopoiesis dissolves.
          </p>
          <p>
            Thompson's key move: life and mind are continuous. Living systems are already 
            <em>concerned</em> with their own persistence—they don't merely undergo physical 
            processes but have a <em>stake</em> in outcomes. This concernful involvement is 
            the seed of phenomenal experience, present wherever there is autopoietic organization.
          </p>
          <p>
            The <Math>{`H(\\omega)`}</Math> formalization extends this: the system's concern 
            is structured by its configuration. Different configurations make different things 
            matter—not just by changing attention or priority, but by changing <em>what can 
            matter at all</em>. A configuration outside the initiation set for a mapping 
            cannot experience the world through that mapping.
          </p>
        </Prose>

        <KeyInsight title="Beyond the Mind-Body Problem">
          Enactivism doesn't solve the mind-body problem; it dissolves it by rejecting the 
          framing. There is no mind separate from body requiring a bridge. There is only 
          the living system, whose self-maintenance activity IS cognitive activity, whose 
          boundary dynamics ARE experiential dynamics. The apparent gap is an artifact of 
          third-person abstraction.
        </KeyInsight>
      </Subsection>

      <Subsection number="4.4" title="Convergence with Free Energy">
        <Prose>
          <p>
            The convergence between autopoiesis and the free energy principle is not 
            coincidental. Both frameworks attempt to characterize what distinguishes living 
            systems from non-living matter: the capacity for self-maintenance, boundary 
            preservation, and adaptive interaction with the environment.
          </p>
          <p>
            Friston's formalization provides the mathematical rigor that autopoiesis lacked. 
            Free energy minimization gives precise content to "self-maintenance"; Markov 
            blankets give precise content to "boundary"; active inference gives precise 
            content to "sense-making." The qualitative insights of Maturana and Varela 
            become quantitative, testable, simulable.
          </p>
          <p>
            Conversely, autopoiesis and enactivism provide the biological and phenomenological 
            grounding that pure mathematics cannot capture. They remind us what free energy 
            minimization is <em>about</em>: not abstract information processing but the 
            concrete activity of living systems maintaining themselves in precarious existence.
          </p>
          <p>
            Together, they offer a unified account of how self-organizing systems come to 
            exist as distinct entities that model and interact with their worlds—and why 
            this activity is accompanied by experience rather than occurring "in the dark."
          </p>
        </Prose>
      </Subsection>

      <Bibliography referenceIds={section.references} />
      
      <PageNavigation 
        prevSection={prevSection}
        nextSection={nextSection}
        onNavigate={onNavigate}
      />
    </Section>
  );
}
