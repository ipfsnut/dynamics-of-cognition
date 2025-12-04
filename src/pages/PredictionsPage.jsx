import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math, MathBlock } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { PredictiveCodingSim } from '../components/simulations/PredictiveCodingSim';

export function PredictionsPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          The <Math>{`H(\\omega)`}</Math> formalization is not merely a philosophical reframing 
          but a framework generating specific, testable predictions that differ from those of 
          standard cognitive science. Orthodox computationalism holds that the body is input/output 
          machinery while cognition happens in the head. Standard embodied cognition holds that 
          the body shapes cognition through metaphor and affordance. The configuration constraint 
          holds something stronger: <strong>the body IS the cognitive state</strong>, and they 
          cannot be separated even in principle.
        </p>
      </Prose>

      <Subsection number="8.1" title="Existing Evidence">
        <Prose>
          <p>
            Existing evidence already supports the configuration constraint, though often 
            interpreted through other theoretical frameworks:
          </p>
          <p>
            <strong>Psychedelics produce insights</strong> that patients describe as inaccessible 
            through years of talk therapy—the configuration change achieves what reflection cannot.
            In <Math>{`H(\\omega)`}</Math> terms: psilocybin flattens the free energy landscape, 
            allowing <Math>{`\\omega`}</Math> to traverse into initiation sets that were previously 
            separated by insurmountable barriers.
          </p>
          <p>
            <strong>EMDR works for trauma</strong> when cognitive processing alone does not—the 
            bilateral stimulation appears to change bodily configuration rather than just 
            cognitive content. The alternating sensory input may expand which 
            <Math>{`I_h`}</Math> regions become accessible.
          </p>
          <p>
            <strong>Propranolol (a beta-blocker) reduces racist implicit bias</strong>—one 
            cannot "think one's way" out of implicit bias, but manipulating the autonomic 
            substrate shifts <Math>{`\\omega`}</Math> into initiation sets that support 
            different evaluative mappings.
          </p>
          <p>
            <strong>Botox reduces depression</strong> through facial feedback—the configuration 
            IS part of the affective state, not merely correlated with it. Blocking muscular 
            patterns literally changes which <Math>{`H(\\omega)`}</Math> is accessible.
          </p>
          <p>
            <strong>Interoceptive training improves emotional regulation</strong>—increasing 
            awareness of bodily states expands the controllable dimensions of <Math>{`\\omega`}</Math>, 
            allowing voluntary access to a wider range of initiation sets.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="8.2" title="Distinguishing From Competitor Theories">
        <Prose>
          <p>
            <strong>Standard computationalism</strong> predicts that bodily manipulations should 
            not affect "pure" cognition—mathematical reasoning, logical inference, abstract 
            problem-solving should be invariant to bodily state. <strong>H(ω) predicts</strong> that 
            all cognition is configuration-dependent, including abstract reasoning.
          </p>
          <p>
            <strong>Standard embodied cognition</strong> predicts that bodily manipulations 
            should influence cognition through metaphor, affordance, and situated action. 
            <strong>H(ω) predicts something stronger:</strong> certain cognitive states are 
            impossible without the corresponding bodily configuration—not harder to access, 
            not biased against, but <em>structurally unreachable</em>.
          </p>
          <p>
            <strong>Precision-weighting models</strong> (as in standard active inference) predict 
            that bodily states affect the <em>weight</em> given to hypotheses within a fixed 
            space. <strong>H(ω) predicts</strong> categorical exclusion: hypotheses can be 
            removed from the hypothesis space entirely, not merely downweighted. The radio 
            frequency metaphor: low volume vs. outside the receiver's range.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Predictive Coding"
          description="Hierarchical prediction error minimization in action."
        >
          {({ width, height }) => (
            <PredictiveCodingSim width={width} height={height} />
          )}
        </SimulationCanvas>
      </Subsection>

      <Subsection number="8.3" title="Specific Testable Predictions">
        <Prose>
          <p>
            <strong>Prediction 1 (Somatic Unreachability):</strong> Somatic interventions should 
            produce cognitive changes unreachable through reflection. Cognitive changes requiring 
            large configuration shifts will be easier to achieve through somatic intervention than 
            through cognitive effort, and the magnitude of this difference should correlate with 
            configuration distance. <em>Test:</em> Compare success rates of body-based vs. 
            cognitive-only therapy for trauma resolution; measure HRV/cortisol configuration 
            before and after.
          </p>
          <p>
            <strong>Prediction 2 (Physiological Gating):</strong> HRV and cortisol markers should 
            predict which cognitive strategies are accessible, not merely which are likely. 
            Successful recall of mood-incongruent memories will be preceded by measurable shifts 
            toward the configuration associated with the target memory. <em>Test:</em> Track 
            continuous physiological monitoring during memory retrieval tasks.
          </p>
          <p>
            <strong>Prediction 3 (Trauma Hysteresis):</strong> Getting INTO a traumatic attractor 
            should be easier than getting OUT, because entry happened at high temperature (acute 
            stress) while exit must happen at low temperature (normal waking state). 
            <em>Test:</em> Document asymmetric transition probabilities; measure whether 
            temperature-raising interventions (psychedelics, MDMA) facilitate exit.
          </p>
          <p>
            <strong>Prediction 4 (Training Expands Initiation Sets):</strong> Training should 
            expand initiation sets, measurable via physiological flexibility—the range of 
            configurations from which a mapping remains accessible should grow with expertise. 
            <em>Test:</em> Compare experts vs. novices on a task while varying physiological 
            state; experts should show wider tolerance for configuration perturbation.
          </p>
          <p>
            <strong>Prediction 5 (Narrowed H(ω) in Psychopathology):</strong> Trauma, depression, 
            and anxiety should show narrowed <Math>{`H(\\omega)`}</Math> via autonomic markers—a 
            restricted set of configurations supporting a restricted set of mappings. 
            <em>Test:</em> Measure autonomic variability (HRV, electrodermal activity) in clinical 
            populations; predict correlation with cognitive flexibility measures.
          </p>
        </Prose>

        <KeyInsight>
          The H(ω) framework generates predictions that are categorically different from both 
          computationalism and standard embodied cognition—testable differences that can 
          adjudicate between frameworks, not just verbal disagreements.
        </KeyInsight>
      </Subsection>

      <Subsection number="8.4" title="Falsification Conditions">
        <Prose>
          <p>
            A theory that cannot be falsified is not empirically useful. <Math>{`H(\\omega)`}</Math> would 
            be falsified—or at minimum seriously undermined—by the following findings:
          </p>
          <p>
            <strong>Falsification 1:</strong> If precision-weighting alone explains all variance 
            in configuration-dependent cognitive accessibility, <Math>{`H(\\omega)`}</Math> adds 
            nothing. <em>Critical test:</em> Find cases where a hypothesis is maximally downweighted 
            by precision but remains accessible (just unlikely), versus cases where it is 
            categorically inaccessible regardless of evidence quality.
          </p>
          <p>
            <strong>Falsification 2:</strong> If cognitive content can be fully specified without 
            reference to achievable bodily states—if the "same thought" can be shown to occur 
            across radically different physiological configurations—then the identity claim 
            (thought = configuration) fails.
          </p>
          <p>
            <strong>Falsification 3:</strong> If somatic interventions never produce cognitive 
            changes that pure cognitive intervention cannot eventually reach, the "unreachability" 
            claim fails. The theories would converge on standard embodied cognition (body influences 
            mind) rather than the stronger claim (body constitutes mind).
          </p>
          <p>
            <strong>Falsification 4:</strong> If experts show no greater tolerance for configuration 
            perturbation than novices—if initiation sets don't expand with learning—the training 
            prediction fails.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="8.5" title="Clinical Implications">
        <Prose>
          <p>
            If <Math>{`H(\\omega)`}</Math> is correct, therapeutic implications follow:
          </p>
          <p>
            <strong>Body-first intervention:</strong> For conditions involving "stuck" 
            configurations (PTSD, chronic depression), somatic interventions (yoga, 
            breathwork, EMDR, somatic experiencing) may access states that talk therapy 
            cannot—not because talk therapy is ineffective, but because the target 
            configurations are outside the initiation sets accessible through verbal processing.
          </p>
          <p>
            <strong>Configuration-aware psychedelics:</strong> The efficacy of psilocybin 
            and MDMA-assisted therapy may depend critically on facilitating configuration 
            changes, not just "insights." The therapy provides the content; the drug provides 
            access to the configurations that can instantiate the content.
          </p>
          <p>
            <strong>Interoceptive training:</strong> Expanding the dimensions of <Math>{`\\omega`}</Math> 
            under voluntary control (through mindfulness, interoceptive training, biofeedback) 
            should expand therapeutic reach—not by providing new techniques, but by making 
            more configurations accessible for existing techniques to work within.
          </p>
        </Prose>

        <KeyInsight title="The Window of Tolerance Formalized">
          Ogden's clinical concept of the "window of tolerance" receives formal treatment: 
          the window IS the region of <Math>{`\\omega`}</Math> space where therapeutic 
          mappings have their initiation sets. Trauma narrows the window by restricting 
          which configurations are achievable; therapy expands it by expanding the achievable 
          configuration space.
        </KeyInsight>
      </Subsection>

      <Subsection number="8.6" title="Thermodynamic Predictions">
        <Prose>
          <p>
            The grounding of <Math>{`H(\\omega)`}</Math> in thermodynamics (Section 7.9) generates 
            additional predictions that are specifically metabolic rather than merely physiological:
          </p>
          <p>
            <strong>Prediction 6 (Glucose-Horizon Correlation):</strong> Blood glucose levels should 
            predict cognitive horizon contraction. Low glucose states should show restricted access 
            to metabolically expensive cognitive operations (creative thinking, complex empathy, 
            long-term planning) while preserving access to cheap operations (habitual responses, 
            immediate concerns). <em>Test:</em> Measure cognitive flexibility across glucose levels; 
            correlate with fMRI markers of prefrontal engagement.
          </p>
          <p>
            <strong>Prediction 7 (Metabolic Affordance Scaling):</strong> Schnall et al.'s finding 
            that glucose affects hill steepness perception should extend to cognitive affordances. 
            Depleted metabolic states should make cognitively "distant" options feel less available—not 
            just harder but phenomenologically absent from the option space. <em>Test:</em> Decision 
            tasks with options varying in cognitive demand; measure perceived availability under 
            glucose manipulation.
          </p>
          <p>
            <strong>Prediction 8 (Sparse Coding Necessity):</strong> Forcing dense neural activation 
            (via stimulants, intensive sustained attention) should rapidly deplete ATP reserves and 
            force return to sparse coding patterns. The 1% concurrency limit should be observable as 
            a thermodynamic ceiling, not merely an architectural preference. <em>Test:</em> Sustained 
            high-load tasks with continuous metabolic monitoring; predict forced sparsification as 
            function of energy depletion.
          </p>
          <p>
            <strong>Prediction 9 (Prediction-Efficiency Link):</strong> More predictive cognitive 
            strategies should correlate with lower metabolic cost per unit of task performance. 
            This follows from Still et al.'s finding that nonpredictive information equals 
            thermodynamic waste. <em>Test:</em> Compare metabolic cost of expert vs. novice 
            performance; experts should show higher bits-per-ATP.
          </p>
          <p>
            <strong>Prediction 10 (Recovery Follows Thermodynamics):</strong> <Math>{`H(\\omega)`}</Math> expansion 
            after rest should follow metabolic recovery curves—specifically glycogen resynthesis and 
            adenosine clearance timecourses. Caffeine (adenosine blocker) should temporarily mask 
            but not reverse contraction. <em>Test:</em> Track cognitive flexibility recovery against 
            metabolic markers; predict mismatch under caffeine.
          </p>
        </Prose>

        <KeyInsight title="The Metabolic Constraint">
          These predictions distinguish the thermodynamic account from purely information-theoretic 
          versions of <Math>{`H(\\omega)`}</Math>. Configuration constraints aren't abstract computational 
          limits—they're ATP budgets. The brain's 20 watts isn't just an implementation detail; 
          it's a constraint that shapes what thoughts are possible.
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
