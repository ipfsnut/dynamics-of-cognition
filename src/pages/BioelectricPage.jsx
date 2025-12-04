import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { MorphogenesisSim } from '../components/simulations/MorphogenesisSim';

export function BioelectricPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          Michael Levin's research program at Tufts University provides the most 
          compelling empirical evidence that intelligence operates by scale-invariant 
          principles. His work demonstrates that developmental and regenerative 
          biology can be understood as <strong>morphogenetic computation</strong>—goal-directed 
          problem-solving in anatomical morphospace rather than three-dimensional behavioral space.
        </p>
        <p>
          The implications for cognition are profound: if cells and tissues exhibit 
          competent goal-directed behavior without neurons, then nervous systems are 
          not the <em>origin</em> of intelligence but rather an evolutionary 
          <em> acceleration</em> of capacities already present in living matter.
        </p>
      </Prose>

      <Subsection number="2.1" title="The Bioelectric Code">
        <Prose>
          <p>
            All cells maintain resting membrane potentials through ion channel and pump 
            activity, and these voltage gradients constitute informational signals that 
            store anatomical patterning instructions. Gap junctions—electrical synapses 
            formed by Connexin proteins—create direct cytoplasmic connections between cells, 
            enabling rapid sharing of voltage states and forming computational networks across tissues.
          </p>
          <p>
            This is not merely electrical activity—it is a <strong>bioelectric code</strong> 
            that specifies large-scale anatomical outcomes. Just as genetic information is 
            encoded in DNA sequences, anatomical target morphology is encoded in bioelectric 
            patterns. And critically: this code can be <em>read</em> and <em>rewritten</em>.
          </p>
          <p>
            Gap junction-mediated electrical coupling allows cells to share voltage states, 
            effectively merging their computational boundaries. When gap junctions close, 
            cells become electrically isolated—their Markov blankets separate. When gap 
            junctions open, cells merge into a larger computational unit with a shared 
            blanket. This is boundary dynamics in real time, visible at the cellular level.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="2.2" title="Key Experimental Demonstrations">
        <Prose>
          <p>
            <strong>Planarian head regeneration and memory:</strong> Planaria (flatworms) 
            can regenerate complete heads from any body fragment. Remarkably, brief exposure 
            to octanol (which blocks gap junctions) permanently rewrites the anatomical 
            "target morphology" stored in bioelectric circuits—producing flatworms that 
            regenerate as two-headed forms for multiple generations without any genetic 
            modification. The bioelectric pattern, not the genome, specifies the anatomy.
          </p>
          <p>
            More striking still: when planaria trained on a behavioral task are decapitated 
            and regenerate new heads, they retain the learned behavior. Memory survives 
            complete brain destruction—stored not in neural tissue but in body-wide 
            bioelectric patterns.
          </p>
          <p>
            <strong>"Picasso tadpole" experiments:</strong> Xenopus (frog) embryos with 
            surgically scrambled craniofacial organs—eyes, nostrils, and jaws in wrong 
            positions—will self-correct over months, with facial structures migrating along 
            novel paths to reach correct final positions. The cells <em>know</em> what the 
            target configuration should be and find novel routes to achieve it. This is 
            goal-directed behavior at the tissue level.
          </p>
          <p>
            <strong>Xenobots—living robots:</strong> Frog skin cells, removed from embryos 
            and left to self-organize, spontaneously form novel "xenobot" morphologies with 
            emergent behaviors: locomotion, collective behavior, and even self-replication. 
            The genome is identical to a normal frog, but the bioelectric context produces 
            radically different anatomies. The same hardware, different software.
          </p>
          <p>
            <strong>Xenopus limb regeneration:</strong> Adult frogs normally cannot 
            regenerate limbs. However, frogs receiving just 24 hours of progesterone 
            exposure via a wearable bioreactor initiated 18 months of limb regeneration, 
            producing functional legs with bone structure, nerve integration, and locomotor 
            capability. The brief chemical intervention shifted the bioelectric setpoint, 
            and the body pursued the new anatomical goal for over a year.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Bioelectric Morphogenesis"
          description="Draw damage on the tissue to see goal-directed regeneration in action."
        >
          {({ width, height }) => (
            <MorphogenesisSim width={width} height={height} />
          )}
        </SimulationCanvas>

        <KeyInsight>
          The genome is hardware; bioelectric patterns are software—explaining how identical 
          DNA can produce radically different anatomies when bioelectric states are altered. 
          Nervous systems are evolutionary "speed optimizations" of pre-existing cellular 
          intelligence, not qualitatively novel inventions.
        </KeyInsight>
      </Subsection>

      <Subsection number="2.3" title="Free Energy Implementation">
        <Prose>
          <p>
            From the perspective of free energy minimization, bioelectric networks implement 
            morphogenetic control through:
          </p>
          <p>
            <strong>Active inference over anatomical configurations:</strong> Cells minimize 
            free energy not in behavioral space but in morphospace—continuously inferring the 
            current anatomical state against a "target morphology" encoded in bioelectric setpoints. 
            The "Picasso tadpole" experiments demonstrate this vividly: cells infer discrepancy 
            between current and target configurations and act to reduce it.
          </p>
          <p>
            <strong>Distributed generative models:</strong> Gap junction-coupled cell networks 
            collectively maintain generative models of normal anatomical configurations, enabling 
            pattern completion and error correction. Damage is detected as prediction error; 
            regeneration is active inference restoring the predicted state.
          </p>
          <p>
            <strong>Hierarchical prediction:</strong> Larger-scale bioelectric patterns constrain 
            local cellular behaviors, instantiating exactly the hierarchical structure that nested 
            Markov blankets formalize. Tissue-level goals override cellular "preferences" just as 
            organism-level goals override tissue-level dynamics.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="2.4" title="Connection to H(ω)">
        <Prose>
          <p>
            The bioelectric framework connects directly to the <Math>{`H(\\omega)`}</Math> formalization 
            developed in Section 7. Bioelectric state is a component of <Math>{`\\omega`}</Math>—the 
            body configuration that determines which mappings are accessible.
          </p>
          <p>
            Consider: the two-headed planarian's bioelectric pattern places the system in a 
            different region of configuration space than normal planaria. Different initiation 
            sets become accessible—the "regenerate two heads" mapping is in <Math>{`H(\\omega)`}</Math> 
            for the altered bioelectric state but not for normal planaria.
          </p>
          <p>
            The xenobot experiments make this vivid: identical genome, different bioelectric 
            context, radically different <Math>{`H(\\omega)`}</Math>. What the cells "can become" 
            is constrained not by their DNA but by their bioelectric configuration—exactly the 
            structure the configuration constraint describes.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="2.5" title="Implications for Cognition">
        <Prose>
          <p>
            The deeper implication is that nervous systems are not the origin of intelligence 
            but rather a <em>speed optimization</em> for pre-existing cellular competencies. As 
            Levin and Dennett argue in "Cognition All the Way Down," evolution did not need to 
            invent intelligence when brains appeared—it needed only to accelerate and extend 
            capabilities already present in living systems.
          </p>
          <p>
            Neural computation is cellular computation, scaled and accelerated. Gap junctions 
            become synapses; bioelectric patterns become neural firing patterns; morphogenetic 
            inference becomes perceptual inference. The same mathematical principles—free energy 
            minimization, Markov blanket dynamics, hierarchical prediction—operate at every level.
          </p>
          <p>
            This reframes the "scale-free" claim concretely: the same computational principles 
            apply whether the system is a cell collective navigating morphospace to maintain 
            anatomical integrity, or a brain navigating belief-space to maintain predictive accuracy. 
            Cognition doesn't emerge at a threshold of neural complexity—it's present wherever 
            self-organizing systems maintain themselves against entropy.
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
