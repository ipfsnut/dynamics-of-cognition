import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math, MathBlock } from '../components/Math';
import { Bibliography } from '../components/Bibliography';

export function SynthesisPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
        isSynthesis={true}
      />

      <Prose>
        <p>
          What emerges from this synthesis is a picture of mind as a natural phenomenon, 
          continuous with the self-organizing processes that characterize all living systems. 
          The same mathematical principles that explain how cells maintain their boundaries 
          explain how brains construct models of the world—and of themselves.
        </p>
      </Prose>

      <Subsection number="12.1" title="Key Integrative Claims">
        <Prose>
          <p>
            <strong>Bioelectricity is the "cognitive glue"</strong> that scales single-cell 
            competencies into collective anatomical intelligence, with gap junctions implementing 
            the merging and separation of Markov blankets.
          </p>
          <p>
            <strong>The genome is hardware; bioelectric patterns are software</strong>—explaining 
            how identical DNA can produce radically different anatomies when bioelectric states 
            are altered.
          </p>
          <p>
            <strong>Nervous systems are evolutionary "speed optimizations"</strong> of pre-existing 
            cellular intelligence, not qualitatively novel inventions.
          </p>
          <p>
            <strong>Feelings are what Markov blanket interfaces feel like from inside</strong>—phenomenal 
            character emerges not from isolated computation but from the relational dynamics where 
            self-organizing systems touch, coordinate, resist, or resonate with each other.
          </p>
          <p>
            <strong>Consciousness is what self-modeling feels like from inside</strong>—the 
            phenomenal character accompanying sufficiently deep hierarchies of self-referential inference.
          </p>
          <p>
            <strong>Language is a specialized communication tool</strong> that enables organisms 
            to share predictions across individual Markov blankets, not the medium of thought itself.
          </p>
          <p>
            <strong>Cognitive accessibility is configuration-dependent</strong>—the set 
            of available interpretive mappings <Math>{`H(\\omega)`}</Math> is a function of 
            physiological state, with the controllosphere providing the neural implementation 
            for accessing mappings outside the current initiation sets.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="12.2" title="The H(ω) Formalization">
        <Prose>
          <p>
            The framework's central theoretical contribution is the formal statement of the 
            configuration constraint:
          </p>
        </Prose>

        <MathBlock>
          {`H(\\omega) = \\{h \\in H : \\omega \\in I_h\\}`}
        </MathBlock>

        <Prose>
          <p>
            This equation synthesizes four research traditions into a unified claim: the set of 
            cognitive mappings available to an organism at any moment is determined by which 
            initiation sets the current body configuration occupies.
          </p>
          <p>
            <strong>From coordination dynamics (HKB):</strong> Body parameters can eliminate 
            stable states entirely through bifurcation—categorical elimination, not probabilistic weighting.
          </p>
          <p>
            <strong>From interoceptive predictive coding (Barrett's EPIC):</strong> The scope 
            is whole-body. Interoception is constitutive of concept construction, not merely 
            input to cognition.
          </p>
          <p>
            <strong>From hierarchical RL (Options framework):</strong> The notation. An option 
            is available in state s iff s ∈ I. We extend: mapping h is available at 
            ω iff <Math>{`\\omega \\in I_h`}</Math>.
          </p>
          <p>
            <strong>From neural energetics (Controllosphere):</strong> The implementation. 
            The intrinsic manifold = <Math>{`H(\\omega)`}</Math>; the controllosphere = 
            <Math>{`h \\notin H(\\omega)`}</Math>. DLPFC pays the metabolic cost of holding 
            ω in regions that support otherwise-inaccessible mappings.
          </p>
        </Prose>

        <KeyInsight title="Beyond Precision-Weighting">
          <Math>{`H(\\omega)`}</Math> differs fundamentally from precision-weighting. Precision 
          assigns weight within a fixed hypothesis space—even very low precision keeps a 
          hypothesis mathematically available. <Math>{`H(\\omega)`}</Math> removes hypotheses 
          from the space entirely for certain configurations. This is the difference between 
          a radio station at low volume versus outside the receiver's frequency range entirely.
        </KeyInsight>
      </Subsection>

      <KeyInsight>
        Minds are what happens when self-organizing systems become fast and flexible enough 
        to model their own boundaries—and language is what happens when they start modeling 
        each other's. The formal structure <Math>{`H(\\omega)`}</Math> captures what it means 
        for cognition to be embodied: not merely influenced by the body, but constitutively 
        constrained by which configurations are achievable.
      </KeyInsight>

      <Prose>
        <p>
          This is not reductionism but integration. The framework doesn't explain consciousness 
          away; it situates it within a broader theoretical structure that makes its emergence 
          intelligible. The boundaries between physics, biology, and psychology blur. 
          Thermodynamics, information theory, and cognitive science converge on a unified 
          description of what it means to persist, to model, and ultimately to know.
        </p>
      </Prose>

      <Subsection number="12.3" title="The Path Forward">
        <Prose>
          <p>
            The synthesis presented here is a beginning, not an end. Much remains to be 
            worked out: the precise mechanisms by which bioelectric dynamics scale to neural 
            dynamics, the empirical tests that can distinguish <Math>{`H(\\omega)`}</Math> from 
            competitor theories like pure precision-weighting, the detailed phenomenology of 
            different interface configurations.
          </p>
          <p>
            <strong>Empirical priorities</strong> include: measuring initiation set boundaries 
            through physiological markers (HRV, cortisol, bioelectric patterns); testing 
            whether somatic interventions produce cognitive changes unreachable through 
            reflection alone; documenting the hysteresis of trauma and the metabolic signatures 
            of controllosphere access.
          </p>
          <p>
            <strong>Theoretical priorities</strong> include: specifying <Math>{`H(\\omega)`}</Math> at 
            different scales of the nested hierarchy; formalizing how learning expands initiation 
            sets; connecting the framework to predictive processing's precision-weighting without 
            collapsing the categorical distinction.
          </p>
          <p>
            But the convergence of mathematical physics, developmental biology, neuroscience, 
            and philosophy on shared principles suggests we may be approaching something like 
            a unified theory of mind. Not a theory that reduces mind to physics, but one that 
            shows how mind is continuous with the rest of nature—an inevitable consequence 
            of the statistical mechanics of persistence, expressed in the language of nested 
            Markov blankets and configuration-dependent accessibility.
          </p>
          <p>
            Intelligence, on this account, is not a mysterious addition to the physical world 
            but what happens when the physical world becomes complex enough to model itself—and 
            embodiment is not merely a constraint on intelligence but its very medium.
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
