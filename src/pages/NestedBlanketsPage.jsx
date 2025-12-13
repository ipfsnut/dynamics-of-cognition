import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { NestedBlanketsSim } from '../components/simulations/NestedBlanketsSim';

export function NestedBlanketsPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          The theoretical integration converges on a hierarchical architecture of 
          <strong> nested Markov blankets</strong>: statistical boundaries within statistical 
          boundaries, from subcellular organelles through cells through tissues through 
          organisms through social groups. This architecture explains how cognition can be 
          simultaneously distributed (operating at multiple scales) and integrated (enabling 
          coherent goal-directed behavior).
        </p>
        <p>
          Crucially, each level of nesting creates <strong>interfaces</strong>—regions where 
          one system's active states become another's sensory states. The interface dynamics 
          framework suggests these boundaries are not merely structural but phenomenologically 
          significant: feelings emerge at the junctions where blankets meet.
        </p>
        <p>
          The <Math>{`H(\\omega)`}</Math> formalization applies at every level: each scale 
          has its own configuration space and its own accessible mapping set. A cell's 
          configuration constrains its cellular-level inference; an organ's configuration 
          constrains tissue-level coordination; the organism's configuration constrains 
          cognitive accessibility.
        </p>
      </Prose>

      <SimulationCanvas 
        title="Nested Markov Blankets"
        description="Explore the same mathematical structure repeating at every scale of organization."
      >
        {({ width, height }) => (
          <NestedBlanketsSim width={width} height={height} />
        )}
      </SimulationCanvas>

      <Subsection number="9.1" title="H(ω) at Each Scale">
        <Prose>
          <p>
            The <Math>{`H(\\omega)`}</Math> structure repeats at each level of the hierarchy, 
            with phenomenal character emerging at the interfaces:
          </p>
          <p>
            <strong>Cell:</strong> Membrane + ion channels as blanket. <Math>{`\\omega`}</Math> 
            includes membrane potential, metabolic state, cytoskeletal configuration. 
            <Math>{`H(\\omega)`}</Math> determines which signaling pathways can be activated, 
            which genes can be expressed, which morphogenetic programs are accessible. 
            <em>Interface feeling: cellular "stress" or "flourishing" depending on whether 
            current demands fall within the cell's accessible response repertoire.</em>
          </p>
          <p>
            <strong>Organ:</strong> Tissue boundaries as blanket. <Math>{`\\omega`}</Math> includes 
            bioelectric patterns, hormonal milieu, immune state. <Math>{`H(\\omega)`}</Math> 
            determines which tissue-level coordination patterns are achievable. 
            <em>Interface feeling: visceral sensations—gut feelings, cardiac awareness, 
            respiratory ease or constriction—tracking organ-level <Math>{`H(\\omega)`}</Math>.</em>
          </p>
          <p>
            <strong>Organism:</strong> Skin + sensory surfaces as blanket. <Math>{`\\omega`}</Math> is 
            the full body configuration (Section 7). <Math>{`H(\\omega)`}</Math> determines cognitive 
            accessibility—which interpretations, actions, and thoughts are achievable. 
            <em>Interface feeling: the felt texture of world-engagement—resistance, flow, 
            cognitive freedom or constraint.</em>
          </p>
          <p>
            <strong>Social:</strong> Communicative interface as blanket. <Math>{`\\omega`}</Math> 
            now includes the collective state of interacting organisms. <Math>{`H(\\omega)`}</Math> 
            at this level determines which social coordination patterns are accessible—which 
            shared understandings can emerge, which collective actions are achievable. 
            <em>Interface feeling: understanding, confusion, connection, loneliness, belonging.</em>
          </p>
        </Prose>

        <KeyInsight>
          Language can be understood as a specialized control system that enables organisms 
          to share predictions across individual Markov blankets. The phenomenology of 
          communication—the feeling of being understood or misunderstood—tracks the 
          dynamics of blanket-to-blanket coupling in real time. Social <Math>{`H(\\omega)`}</Math> 
          is co-constructed through linguistic interaction.
        </KeyInsight>
      </Subsection>

      <Subsection number="9.2" title="Hierarchical Integration">
        <Prose>
          <p>
            The nested architecture solves a fundamental problem: how can a system be both 
            autonomous (maintaining its own boundaries) and integrated (coordinating with 
            other systems)? The answer lies in the hierarchical structure itself.
          </p>
          <p>
            Lower-level blankets maintain local autonomy—cells regulate their own internal 
            states. But they are also nested within higher-level blankets—organs coordinate 
            cellular behavior toward tissue-level goals. This continues upward: organisms 
            coordinate organ function, social groups coordinate organismal behavior.
          </p>
          <p>
            At each level, the higher blanket constrains but does not determine the lower. 
            Cells retain agency within the constraints imposed by tissue-level organization. 
            This is not top-down control but nested constraint satisfaction—each level finding 
            its own free energy minimum within the landscape defined by the level above.
          </p>
          <p>
            In <Math>{`H(\\omega)`}</Math> terms: the higher level's configuration constrains 
            which initiation sets are accessible at lower levels. The organism's autonomic 
            state constrains which cellular responses are possible; the social context 
            constrains which organismal configurations are sustainable.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="9.3" title="Cross-Scale Causation">
        <Prose>
          <p>
            The nested architecture enables cross-scale causal influence. Higher-level 
            configurations can shift lower-level <Math>{`H(\\omega)`}</Math>: organismal 
            stress hormones change which cellular programs are accessible. Lower-level 
            configurations bubble up: cellular dysfunction (inflammation, metabolic disruption) 
            narrows organismal <Math>{`H(\\omega)`}</Math>.
          </p>
          <p>
            This is why purely "cognitive" interventions often fail for conditions with 
            physiological components, and why somatic interventions can have profound 
            cognitive effects. The levels are not independent—changes propagate up and 
            down the hierarchy, reshaping <Math>{`H(\\omega)`}</Math> at every scale.
          </p>
          <p>
            The controllosphere concept (Section 6) provides the mechanism: accessing 
            configurations outside the current <Math>{`H(\\omega)`}</Math> at any level 
            requires metabolic expenditure. Sustained cross-scale reorganization—trauma 
            recovery, deep learning, transformative experience—requires sustained metabolic 
            investment to hold open non-default configurations long enough for them to 
            become new defaults.
          </p>
        </Prose>

        <KeyInsight title="The Scaling Principle">
          The same formal structure—<Math>{`H(\\omega) = \\{h \\in H : \\omega \\in I_h\\}`}</Math>—applies 
          at every scale, but <Math>{`\\omega`}</Math> and <Math>{`H`}</Math> have different 
          content at each level. Scale-free intelligence means the <em>form</em> of the 
          constraint is invariant even as its <em>content</em> varies across orders of magnitude.
        </KeyInsight>
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
