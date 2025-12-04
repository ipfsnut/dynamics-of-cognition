import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math, MathBlock } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { ControllosphereSim } from '../components/simulations/ControllosphereSim';
import { FatigueRecoverySim } from '../components/simulations/FatigueRecoverySim';

export function ControllospherePage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          Clay Holroyd's controllosphere concept, developed in his 2024 <em>Psychological 
          Review</em> paper, provides a neural implementation account of how effortful control 
          relates to free energy minimization. The framework distinguishes between two 
          fundamental modes of neural operation—and connects directly to the configuration 
          constraint developed in Section 7.
        </p>
      </Prose>

      <Subsection number="6.1" title="Two Modes of Processing">
        <Prose>
          <p>
            <strong>The intrinsic manifold</strong> is a low-dimensional, energy-efficient 
            subspace of neural state space where automatic processing resides. This represents 
            the "default" state of the system—the well-worn grooves of habituated thought and 
            action. Processing here is metabolically cheap and cognitively effortless.
          </p>
          <p>
            <strong>The controllosphere</strong> is an energy-inefficient region accessed when 
            controlled processing is required. Transitions here are metabolically costly and 
            subjectively experienced as effortful. The system resists entering this space, and 
            for good reason.
          </p>
          <p>
            In the language of the configuration constraint: the intrinsic manifold contains 
            mappings in <Math>{`H(\\omega)`}</Math>—those your current physiological configuration 
            already supports. The controllosphere contains mappings where <Math>{`\\omega`}</Math> is 
            at the edge of, or outside, their initiation sets <Math>{`I_h`}</Math>. Effort is 
            the metabolic cost of <em>holding open</em> a configuration that isn't naturally stable.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="6.2" title="The Architecture of Effort">
        <Prose>
          <p>
            The architecture involves <strong>DLPFC</strong> (dorsolateral prefrontal cortex) 
            as controller, driving system states into the controllosphere, and <strong>ACC</strong> 
            (anterior cingulate cortex) as observer, monitoring changes in the controlled 
            system's state. Cognitive effort scales with the energetic demands of the DLPFC 
            control signal, particularly when control consequences are unobservable by ACC.
          </p>
          <p>
            This maps onto the H(ω) framework precisely. DLPFC is the <em>mapping-switcher</em>: 
            it burns metabolic resources to virtually evaluate and instantiate mappings outside 
            the current basin. ACC monitors whether the attempted mapping is actually producing 
            useful prediction error reduction—whether the excursion into the controllosphere 
            is "paying off."
          </p>
        </Prose>

        <SimulationCanvas 
          title="Controllosphere Dynamics"
          description="Adjust DLPFC signal to push neural state into the controllosphere. Watch metabolic costs and waste accumulation."
        >
          {({ width, height }) => (
            <ControllosphereSim width={width} height={height} />
          )}
        </SimulationCanvas>

        <Prose>
          <p>
            Holroyd describes a hierarchical architecture with three levels: <strong>meta-tasks</strong> 
            (high-level goals like "complete the project"), <strong>tasks</strong> (specific 
            subgoals like "write the introduction"), and <strong>actions</strong> (motor and 
            cognitive operations). Each level has its own timescale and controllosphere dynamics.
          </p>
          <p>
            This hierarchy maps onto nested configuration constraints. Meta-task selection 
            determines which subset of tasks are in <Math>{`H(\\omega)`}</Math>; task selection 
            determines which actions are accessible. You can't access fine-grained action 
            mappings without first configuring for the appropriate task context.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="6.3" title="The Neural Waste Hypothesis">
        <Prose>
          <p>
            The novel <strong>neural waste hypothesis</strong> proposes that transitions 
            through the controllosphere lead to buildup of metabolic byproducts: beta-amyloid 
            peptides, glutamate, and adenosine. These accumulations are not merely incidental—they 
            serve a protective function, creating an aversive signal that discourages extended 
            periods of high control.
          </p>
          <p>
            In configuration constraint terms: waste accumulation is <em>the body enforcing 
            the constraint</em>. You're trying to run mappings your current ω doesn't naturally 
            support. The system is signaling: "this is unsustainable—return to H(ω) or reconfigure."
          </p>
          <p>
            Cognitive effort, on this account, is not simply "hard"—it is genuinely costly 
            at the cellular level, and the feeling of effort tracks this cost. The system is 
            designed to stay on the intrinsic manifold whenever possible, reserving the 
            controllosphere for genuine emergencies of adaptive behavior.
          </p>
        </Prose>

        <KeyInsight title="The Body's Veto">
          Waste accumulation represents the body exercising its constraint on cognition. 
          No amount of "willpower" can indefinitely override the fundamental reality that 
          mappings outside H(ω) are metabolically expensive to instantiate. The fatigue 
          signal isn't weakness—it's the configuration constraint making itself felt.
        </KeyInsight>
      </Subsection>

      <Subsection number="6.4" title="Fatigue, Recovery, and Learning">
        <Prose>
          <p>
            <strong>Recovery</strong> is returning to <Math>{`H(\\omega)`}</Math>—letting the 
            system settle back to configurations it can maintain, allowing waste clearance 
            through glymphatic flow during rest and sleep. This isn't merely "taking a break" 
            but genuine metabolic restoration.
          </p>
          <p>
            <strong>Learning and expertise</strong> represent a different solution: expanding 
            the initiation set <Math>{`I_h`}</Math> for frequently-needed mappings so they 
            eventually join the intrinsic manifold. What once required controllosphere access 
            becomes automatic. The Stroop task is effortful for novices because reading-suppression 
            requires controllosphere access; for experts who've practiced extensively, the 
            mapping has moved to the manifold.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Fatigue and Recovery Dynamics"
          description="Simulate task blocks requiring effortful control, then observe recovery during rest."
        >
          {({ width, height }) => (
            <FatigueRecoverySim width={width} height={height} />
          )}
        </SimulationCanvas>

        <Prose>
          <p>
            This explains why <strong>deliberate practice</strong> is exhausting but essential: 
            it's the repeated excursion into the controllosphere that gradually expands what 
            configurations can support the target mapping. And it explains why <strong>overtraining</strong> 
            backfires: if waste accumulates faster than it clears, the body's constraint signal 
            overwhelms any learning benefit.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="6.5" title="Integration with Free Energy">
        <KeyInsight>
          The intrinsic manifold represents an attractor state of low free energy—configurations 
          where predictions and sensory input are well-matched. The controllosphere is where 
          the system tolerates temporarily elevated free energy in service of finding better 
          long-term minima. ACC monitors expected free energy reduction; DLPFC pays the 
          metabolic cost of the search. The hierarchical architecture—from meta-tasks to 
          tasks to actions—reflects scale-free principles operating at different temporal scales.
        </KeyInsight>

        <Prose>
          <p>
            Holroyd's framework thus provides the <em>neural implementation</em> for what 
            the configuration constraint describes <em>formally</em>. The intrinsic manifold 
            is where <Math>{`\\omega \\in I_h`}</Math> for the active mappings; the controllosphere 
            is where <Math>{`\\omega`}</Math> is being pushed toward initiation sets it doesn't 
            naturally occupy. DLPFC is the metabolically expensive machinery for this pushing; 
            waste accumulation is the body's signal that the constraint is being violated.
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
