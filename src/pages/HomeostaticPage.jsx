import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math, MathBlock } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { HomeostaticSim } from '../components/simulations/HomeostaticSim';
import { InteroceptivePathwaySim } from '../components/simulations/InteroceptivePathwaySim';

export function HomeostaticPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          Antonio Damasio's theoretical program provides the phenomenological complement 
          to Friston's mathematical formalism. Where FEP describes the statistical structure 
          of adaptive systems, Damasio's framework explains <em>why this structure matters 
          for consciousness</em>—why feelings are foundational rather than epiphenomenal. 
          Anil Seth's work on interoceptive inference provides the crucial bridge, showing 
          how predictive coding applied to bodily signals generates the felt sense of being 
          a living organism.
        </p>
      </Prose>

      <Subsection number="3.1" title="Damasio's Framework: Feelings as Foundational">
        <Prose>
          <p>
            The core thesis is that consciousness arises from the continued presence of 
            <strong> homeostatic feelings</strong>—mental experiences of body states as they 
            undergo regulation. In their 2024 <em>Philosophical Transactions</em> paper, 
            Damasio and Damasio argue that homeostatic feelings "were the inaugural phenomena 
            of consciousness in biological evolution."
          </p>
          <p>
            The framework proceeds through a hierarchical integration chain:
          </p>
          <p>
            <strong>Protoself:</strong> A pre-conscious "coherent collection of neural patterns 
            which map moment-by-moment the state of the physical structure of the organism."
          </p>
          <p>
            <strong>Core consciousness:</strong> Emerges when organisms become aware of feelings 
            associated with changes in internal bodily states and recognize that their thoughts 
            are their own—the "feeling of what happens."
          </p>
          <p>
            <strong>Autobiographical self:</strong> Results from integration of past memories 
            and anticipated futures with the protoself, generating extended temporal identity.
          </p>
          <p>
            Critically, Damasio's somatic marker hypothesis (1994, 1996) demonstrated that 
            patients with damage to ventromedial prefrontal cortex—despite intact reasoning 
            abilities—made catastrophically poor real-world decisions. The Iowa gambling task 
            revealed that these patients failed to develop the "gut feelings" that guide 
            healthy decision-making, suggesting that feelings are not opposed to rationality 
            but essential to it.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Homeostatic Feelings"
          description="Watch how bodily prediction errors become feelings as the system maintains homeostasis."
        >
          {({ width, height }) => (
            <HomeostaticSim width={width} height={height} />
          )}
        </SimulationCanvas>

        <KeyInsight>
          Feelings are not responses to cognition—they guide it. Damasio's clinical evidence 
          shows that without the capacity for bodily feelings, "rational" thought becomes 
          functionally irrational.
        </KeyInsight>
      </Subsection>

      <Subsection number="3.2" title="Interoceptive Inference: The Friston-Damasio Bridge">
        <Prose>
          <p>
            Anil Seth's 2013 paper "Interoceptive inference, emotion, and the embodied self" 
            provides the mathematical connection between Damasio's phenomenology and Friston's 
            free energy framework. The key insight: <strong>the brain runs a generative model 
            of the body, not just the external world</strong>.
          </p>
          <p>
            Where classical predictive coding focused on exteroceptive signals (vision, audition), 
            Seth extended the framework to interoception—the sense of the internal physiological 
            condition of the body. The brain continuously predicts its own visceral signals: 
            heartbeat, respiration, gut activity, blood chemistry. Interoceptive prediction 
            errors are not merely registered—they are <em>felt</em>.
          </p>
        </Prose>

        <MathBlock>
          {`F = \\underbrace{D_{KL}[q(\\mu) || p(\\mu|s_e, s_i)]}_{\\text{model complexity}} + \\underbrace{\\mathbb{E}_q[-\\ln p(s_e, s_i)]}_{\\text{prediction error}}`}
        </MathBlock>

        <Prose>
          <p>
            Here <Math>{`s_e`}</Math> represents exteroceptive signals and <Math>{`s_i`}</Math> represents 
            interoceptive signals. The brain minimizes free energy across both channels simultaneously, 
            but the interoceptive channel has a special property: its prediction errors carry 
            <strong> valence</strong>.
          </p>
          <p>
            Seth and Friston's 2016 collaboration made this explicit: subjective feeling states 
            arise from "actively-inferred generative models of the causes of interoceptive 
            afferents." Crucially, they introduced the role of <strong>precision-weighting</strong>: 
            the confidence assigned to interoceptive predictions modulates emotional intensity. 
            High-precision interoceptive prediction errors feel <em>worse</em>—they demand 
            urgent action.
          </p>
          <p>
            This framework also incorporates <strong>allostasis</strong>—predictive regulation 
            that anticipates bodily needs before they arise. Lisa Feldman Barrett's (2017) 
            theory of constructed emotion extends this further: emotions are not triggered 
            responses but active constructions that serve allostatic regulation. The brain 
            categorizes interoceptive signals using prior experience to generate emotions 
            that prepare the body for anticipated demands.
          </p>
        </Prose>

        <KeyInsight>
          Interoceptive prediction errors ARE experienced as feelings. This is not a metaphor—it 
          is the proposed mechanism. The mathematical machinery of free energy minimization, 
          applied to visceral signals, generates the felt sense of bodily existence.
        </KeyInsight>
      </Subsection>

      <Subsection number="3.3" title="The Neuroanatomy of Feeling">
        <Prose>
          <p>
            Bud Craig's work (2002, 2009) mapped the neural pathway that makes interoceptive 
            inference possible. The <strong>lamina I spinothalamocortical pathway</strong> carries 
            signals about the body's physiological condition—temperature, pain, itch, muscular 
            and visceral sensations, metabolic status—through a distinct anatomical route.
          </p>
          <p>
            This pathway terminates in the <strong>posterior insula</strong>, which functions as 
            primary interoceptive cortex—analogous to V1 for vision. From there, signals flow 
            anteriorly through a "posterior-to-anterior sequence of increasingly homeostatically 
            efficient representations." The <strong>anterior insula</strong> integrates these 
            signals with contextual information to generate what Craig calls a "global emotional 
            moment"—a unified representation of how the body is doing right now.
          </p>
          <p>
            Craig documented that the anterior insula is activated by an remarkably diverse 
            range of conditions: "bowel distension and orgasm, cigarette craving and maternal 
            love, decision making and sudden insight." This apparent heterogeneity makes sense 
            if the anterior insula's function is to represent <em>the current state of the 
            embodied self</em>—whatever that state happens to be.
          </p>
          <p>
            Architecturally, interoception differs from exteroception in important ways. 
            Interoceptive neurons are often unmyelinated (slower, more diffuse signaling). 
            The blood-brain barrier is more permeable in interoceptive regions, allowing 
            direct chemical communication. And the pathways are heavily bidirectional—the 
            brain doesn't just receive visceral signals, it actively regulates the viscera 
            through autonomic efferents. This bidirectionality is precisely what active 
            inference requires.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Interoceptive Pathway"
          description="Signals flow from body through integration layers to the unified 'now' — your global emotional moment."
        >
          {({ width, height }) => (
            <InteroceptivePathwaySim width={width} height={height} />
          )}
        </SimulationCanvas>
      </Subsection>

      <Subsection number="3.4" title="Empirical Evidence">
        <Prose>
          <p>
            The interoceptive inference framework generates testable predictions, and a 
            substantial empirical literature now supports its core claims.
          </p>
          <p>
            <strong>Heartbeat detection studies:</strong> Critchley et al. (2004) used fMRI 
            during a heartbeat detection task and found that "in right anterior insular/opercular 
            cortex, neural activity predicted subjects' accuracy in the heartbeat detection 
            task." People who were better at detecting their own heartbeats showed stronger 
            insula activation. Critically, "indices of negative emotional experience correlated 
            with interoceptive accuracy across subjects"—those more attuned to their bodies 
            reported more intense emotions.
          </p>
          <p>
            <strong>Three-dimensional model:</strong> Garfinkel et al. (2015) refined the 
            framework by distinguishing three dimensions of interoception that are "distinct 
            and dissociable": <em>interoceptive accuracy</em> (objective performance on tasks 
            like heartbeat detection), <em>interoceptive sensibility</em> (self-reported beliefs 
            about one's interoceptive abilities), and <em>interoceptive awareness</em> (the 
            correspondence between accuracy and sensibility—metacognitive insight into one's 
            own interoception).
          </p>
          <p>
            <strong>Clinical implications:</strong> Critchley and Garfinkel's 2017 review 
            documented how disrupted interoception appears across psychiatric conditions: 
            anxiety disorders show heightened interoceptive prediction errors; depression 
            shows blunted interoceptive precision; eating disorders involve systematic 
            misrepresentation of hunger and satiety signals. These aren't peripheral symptoms 
            but potential core mechanisms.
          </p>
          <p>
            <strong>Lesion evidence:</strong> Damage to the insula disrupts emotional experience 
            in ways consistent with the framework. Patients report that emotions feel "distant" 
            or "intellectual"—they know they should feel something but the visceral component 
            is absent.
          </p>
          <p>
            These findings connect directly to the configuration constraint developed in 
            Section 7: interoceptive state is a core component of the body configuration 
            <Math>{`\\omega`}</Math> that determines cognitive accessibility. Disrupted 
            interoception doesn't just change how emotions <em>feel</em>—it changes which 
            cognitive mappings are accessible at all.
          </p>
        </Prose>

        <KeyInsight>
          The three-dimensional model matters: you can be accurate without knowing it, confident 
          without being accurate, or well-calibrated across both. Interoceptive awareness—knowing 
          how good you are at sensing your body—may be crucial for emotional regulation.
        </KeyInsight>
      </Subsection>

      <Subsection number="3.5" title="What This Explains and What Remains Open">
        <Prose>
          <p>
            <strong>What interoceptive inference explains:</strong>
          </p>
          <p>
            • <em>Why feelings track body states:</em> Because feelings ARE the phenomenology 
            of interoceptive prediction errors. The content of feelings reflects the content 
            of the generative model's predictions about visceral causes.
          </p>
          <p>
            • <em>Why feelings have valence:</em> Prediction errors that signal threats to 
            homeostasis are weighted with high precision and feel bad; those that signal 
            successful regulation are weighted differently and feel good. Valence tracks 
            allostatic relevance.
          </p>
          <p>
            • <em>Why feelings guide behavior:</em> Minimizing interoceptive free energy 
            requires either updating predictions (perceptual inference) or acting on the 
            world to change bodily states (active inference). Feelings motivate the actions 
            that maintain homeostasis.
          </p>
          <p>
            • <em>Why the body-brain partnership matters:</em> Consciousness requires 
            interoception, and interoception requires a body to sense. You cannot have 
            feelings without something to have feelings <em>about</em>.
          </p>
          <p>
            <strong>What remains genuinely open:</strong>
          </p>
          <p>
            The framework explains why interoceptive inference has the <em>functional 
            properties</em> of consciousness—self-reference, valence, motivation, unity. 
            It does not yet explain why interoceptive inference <em>feels like anything 
            at all</em>. This is the hard problem, and we should be honest that interoceptive 
            inference may be <strong>necessary but not sufficient</strong> for consciousness.
          </p>
          <p>
            The framework identifies <em>what</em> the neural correlates of feeling are 
            (interoceptive predictions and prediction errors in insula and related structures). 
            It does not explain <em>why</em> these particular neural processes are accompanied 
            by phenomenal experience when other equally complex processes (e.g., cerebellar 
            motor coordination) apparently are not.
          </p>
          <p>
            We take the position that this is an empirical question to be resolved, not a 
            conceptual puzzle to be dissolved by philosophical argument. The hard problem 
            may or may not have a solution within current paradigms. What interoceptive 
            inference gives us is a rigorous framework for investigating the structure 
            of feeling—which feelings arise under which conditions, how they relate to 
            bodily states, how they can be modulated—regardless of whether the ultimate 
            nature of phenomenal experience is resolved.
          </p>
        </Prose>

        <KeyInsight>
          We are not claiming to dissolve the hard problem. We are claiming that interoceptive 
          inference provides the best current framework for understanding the structure and 
          function of feelings—what they track, why they have valence, how they guide behavior. 
          The question of why any of this is experienced at all remains open.
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
