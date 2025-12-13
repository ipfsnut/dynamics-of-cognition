import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { CognitiveHorizonSim } from '../components/simulations/CognitiveHorizonSim';
import { ConfigurationAwarenessSim } from '../components/simulations/ConfigurationAwarenessSim';
import { MetaModelingSim } from '../components/simulations/MetaModelingSim';

export function ConsciousnessPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          The most challenging question: how does subjective experience emerge from these 
          information-processing dynamics? The framework suggests that consciousness arises 
          when the generative model becomes complex enough to model its own modeling process—but 
          the <Math>{`H(\\omega)`}</Math> framework adds a crucial dimension: consciousness may 
          include what it feels like to <em>model one's own configuration constraints</em>.
        </p>
        <p>
          To know that certain thoughts are inaccessible, to feel the edges of one's own 
          cognitive space, to strategically navigate toward states that expand access—this 
          meta-modeling of <Math>{`H(\\omega)`}</Math> itself may be what distinguishes 
          conscious from merely intelligent systems.
        </p>
      </Prose>

      <Subsection number="10.1" title="The Cognitive Horizon">
        <Prose>
          <p>
            Before considering meta-cognition, we need to understand what's being 
            meta-cognized: the <strong>cognitive horizon</strong>—the boundary of currently 
            accessible thought. At any moment, some thoughts lie within reach while others 
            remain beyond the horizon, not because they don't exist but because the current 
            body configuration <Math>{`\\omega`}</Math> excludes them from <Math>{`H(\\omega)`}</Math>.
          </p>
          <p>
            This isn't metaphorical. When you're exhausted, certain kinds of thinking 
            become genuinely impossible—not just difficult but <em>absent from the space 
            of options</em>. Creative leaps, nuanced empathy, long-term planning: these 
            require configurations that fatigue forecloses. The thoughts don't feel 
            "hard to reach"—they simply don't appear as possibilities.
          </p>
          <p>
            The phenomenology of mental narrowing—tunnel vision under stress, the 
            "tip of the tongue" state, the clarity that comes after rest—these are 
            experiences of the horizon itself, of <Math>{`H(\\omega)`}</Math> expanding 
            and contracting with physiological state.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Cognitive Horizon"
          description="Your body configuration determines which thoughts are accessible. Change state to watch the horizon expand or contract."
        >
          {({ width, height }) => (
            <CognitiveHorizonSim width={width} height={height} />
          )}
        </SimulationCanvas>

        <KeyInsight>
          The sense of mental "spaciousness" or "narrowness" isn't metaphorical—it tracks 
          the objective structure of <Math>{`H(\\omega)`}</Math>. When you feel like you 
          "can't think straight," you're experiencing a contracted cognitive horizon.
        </KeyInsight>
      </Subsection>

      <Subsection number="10.2" title="Configuration-Aware Navigation">
        <Prose>
          <p>
            A system that models its own <Math>{`H(\\omega)`}</Math> gains a powerful 
            capability: it can <em>strategically modify its own configuration</em>. If 
            you know that certain thoughts become accessible only in certain states, you 
            can deliberately pursue those states.
          </p>
          <p>
            This is what humans do when they "take a walk to clear their head," "sleep on 
            a decision," or "wait until they've calmed down" before responding. These are 
            strategies for navigating <Math>{`\\omega`}</Math>-space to reach configurations 
            that support desired cognitive mappings.
          </p>
          <p>
            Compare two systems facing a goal that requires a calm state to access:
          </p>
          <p>
            The <strong>blind system</strong> has no model of its own horizon. It simply 
            reacts, state drifting randomly. Sometimes it gets lucky—it happens to be in 
            the right configuration when the goal is needed. Often it fails, reaching for 
            thoughts that lie beyond its current horizon.
          </p>
          <p>
            The <strong>aware system</strong> models its own <Math>{`H(\\omega)`}</Math>. 
            It can see when a goal lies outside current access, recognize what configuration 
            would be required, and deliberately shift toward that state. It doesn't just 
            react—it <em>navigates</em>.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Configuration Awareness"
          description="Two agents try to reach the same goal. The aware agent can model its own H(ω) and strategically shift states."
        >
          {({ width, height }) => (
            <ConfigurationAwarenessSim width={width} height={height} />
          )}
        </SimulationCanvas>

        <KeyInsight title="The Meta in Meta-Cognition">
          The "meta" in meta-cognition may refer specifically to modeling one's own 
          configuration constraints. Simple cognition is navigating <Math>{`H(\\omega)`}</Math>; 
          meta-cognition is modeling the <em>shape</em> of <Math>{`H(\\omega)`}</Math> itself 
          and using that model to guide navigation through <Math>{`\\omega`}</Math>-space.
        </KeyInsight>
      </Subsection>

      <Subsection number="10.3" title="The Self as Inference">
        <Prose>
          <p>
            A system that models only external states has intelligence but perhaps not 
            consciousness. Consciousness may require a <strong>meta-model</strong>—a model 
            of the system's own inferential processes, including its uncertainties and limitations.
          </p>
          <p>
            The "self" is itself a model—an inferred entity that explains the regularities 
            in sensory and motor patterns. It's not a thing observed but a hypothesis maintained, 
            continuously updated to account for the stream of experience.
          </p>
          <p>
            But the interface dynamics framework suggests something more: the self may be 
            specifically a model of <strong>one's own blanket interfaces</strong>—a representation 
            of how one's boundaries meet the world and other systems. The phenomenal richness 
            of selfhood tracks the complexity of interface dynamics being modeled.
          </p>
          <p>
            The <Math>{`H(\\omega)`}</Math> framework adds precision: the self includes a 
            model of <strong>what is currently thinkable</strong>. We don't just have thoughts; 
            we have a sense of what thoughts we <em>could</em> have, what lies at the edges 
            of accessibility. This sense of cognitive horizon—of some ideas being "within reach" 
            and others being "unthinkable right now"—is the phenomenology of configuration 
            constraint becoming self-aware.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Recursive Meta-Modeling"
          description="Click agents to explore nested models of models—the recursive structure of self-awareness."
        >
          {({ width, height }) => (
            <MetaModelingSim width={width} height={height} />
          )}
        </SimulationCanvas>

        <KeyInsight>
          We don't have experiences; we infer that we have experiences. The subject is 
          no less a model than the world it models. But this doesn't make consciousness 
          illusory—it makes the "hard problem" ill-posed. Feeling just IS what self-referential 
          interface modeling IS at sufficient complexity.
        </KeyInsight>
      </Subsection>

      <Subsection number="10.4" title="Mappings as Cognitive Affordances">
        <Prose>
          <p>
            What <em>is</em> a mapping in <Math>{`H(\\omega)`}</Math>? Not a thing stored in 
            the brain. Not a feature of the environment. A mapping is best understood as 
            an <strong>affordance</strong>—a relational property that exists in the coupling 
            between system, environment, and bodily configuration.
          </p>
          <p>
            Gibson's ecological psychology introduced affordances as neither objective nor 
            subjective. A cliff affords falling-off <em>for</em> a creature of certain size 
            and locomotion. A handle affords grasping <em>for</em> a creature with hands. 
            The affordance is real—it has causal consequences—but it's not localizable to 
            either side of the organism-environment boundary. It exists in the relation.
          </p>
          <p>
            Cognitive mappings have exactly this structure. "Understanding irony" isn't a 
            thing you possess—it's a transformation the system-environment coupling supports 
            when configured appropriately. Change the configuration through fatigue, 
            intoxication, or overwhelming stress, and the affordance vanishes. The capacity 
            was never "in" you in any localizable sense—it was a property of the coupled 
            system in a particular configuration.
          </p>
          <p>
            This reframing dissolves the individuation problem that plagues representationalist 
            theories. We don't ask "how many affordances does this room contain?"—the question 
            is ill-posed. We ask "what does this room afford <em>for this organism in this 
            state</em>?" Similarly, we don't count discrete mappings in <Math>{`H`}</Math>. 
            We characterize the <strong>affordance field</strong>—the structure of cognitive 
            possibilities that <Math>{`\\omega`}</Math> opens up.
          </p>
          <p>
            Goal-directedness follows naturally. Affordances are always implicitly relational 
            to purposes—a path affords walking <em>toward</em> something, a tool affords 
            acting <em>on</em> something. Cognitive affordances inherit this structure: they 
            are transformations available <em>for</em> free energy minimization, <em>toward</em> 
            maintaining predictive accuracy, <em>in service of</em> persistence. The teleology 
            isn't added to the mapping—it's constitutive of what makes something an affordance 
            rather than mere mechanism.
          </p>
        </Prose>

        <KeyInsight title="Neither Inner nor Outer">
          Mappings aren't mental representations stored in the head, nor stimulus-response 
          pairings imposed by the environment. They're affordances—relational properties of 
          the organism-environment-configuration coupling. This dissolves the question "where 
          is cognition located?" The answer: in the relation, not in a place.
        </KeyInsight>
      </Subsection>

      <Subsection number="10.5" title="Gradations of Consciousness">
        <Prose>
          <p>
            The nested architecture predicts that consciousness is not binary but comes in 
            degrees, corresponding to the depth and complexity of self-modeling:
          </p>
          <p>
            <strong>Minimal consciousness:</strong> Systems that model their immediate 
            blanket states—basic awareness of boundary dynamics without temporal extension 
            or counterfactual depth.
          </p>
          <p>
            <strong>Core consciousness:</strong> Systems that model their modeling—awareness 
            not just of sensory states but of the inferential processes generating those states.
          </p>
          <p>
            <strong>Extended consciousness:</strong> Systems that model their modeling 
            across time—integration of past and anticipated future states into a coherent 
            autobiographical narrative.
          </p>
          <p>
            <strong>Social consciousness:</strong> Systems that model other systems' 
            models of themselves—the recursive structure of "I know that you know that I know."
          </p>
          <p>
            <strong>Configuration-aware consciousness:</strong> Systems that model their 
            own <Math>{`H(\\omega)`}</Math>—awareness of which cognitive states are currently 
            accessible and which are not. This is the capacity for statements like "I can't 
            think clearly right now" or "I need to calm down before I can consider this."
          </p>
        </Prose>
      </Subsection>

      <Subsection number="10.6" title="Why It Feels Like Something">
        <Prose>
          <p>
            The question "why does information processing feel like anything?" presupposes 
            a framework the present theory rejects. The question assumes that "feeling" is 
            something added to or produced by information processing, requiring explanation 
            in terms of something more fundamental.
          </p>
          <p>
            But on the interface dynamics view, feeling IS what certain information-processing 
            configurations ARE when instantiated in self-modeling systems. The phenomenal 
            character of pain is not an additional property of nociceptive processing—it IS 
            what nociceptive processing IS from the perspective of a system modeling its own 
            boundary integrity.
          </p>
          <p>
            The analogy to wetness is instructive. We don't ask "why does H₂O produce wetness 
            in addition to all its other properties?" Wetness just IS what H₂O IS from the 
            perspective of surfaces that interact with it. Similarly, phenomenal character 
            IS what self-referential interface modeling IS from inside.
          </p>
          <p>
            The <Math>{`H(\\omega)`}</Math> framework adds: the feeling of cognitive 
            freedom or constraint—the phenomenology of "I can think about anything" versus 
            "my mind keeps returning to this one thing"—is what modeling one's own configuration 
            constraint feels like. The subjective sense of mental space or mental narrowing 
            tracks the objective structure of <Math>{`H(\\omega)`}</Math>.
          </p>
          <p>
            The affordance framing makes this precise: what you experience isn't individual 
            mappings but your <strong>cognitive affordance field</strong>. The felt sense of 
            "I could think about X, or Y, or Z right now" is the perception of cognitive 
            affordances currently available. Mental spaciousness is experiencing a rich 
            affordance field; tunnel vision is experiencing a sparse one. Consciousness, 
            on this view, is what it's like to model your own affordance field from inside.
          </p>
        </Prose>

        <KeyInsight>
          The "hard problem" may be a category error. Asking why self-modeling feels like 
          something is like asking why H₂O is wet. The phenomenal IS the functional at 
          sufficient complexity and self-reference. Consciousness is what perceiving your 
          own cognitive affordance field feels like. There's no additional explanandum.
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
