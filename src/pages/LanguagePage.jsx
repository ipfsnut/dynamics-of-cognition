import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math, MathBlock } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { LanguageControllerSim } from '../components/simulations/LanguageControllerSim';

export function LanguagePage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          Evelina Fedorenko's neuroscience research at MIT has produced perhaps the most 
          careful characterization of the "language network"—regions that respond selectively 
          to linguistic input while remaining silent during math, music, code, and logic. 
          Her individual-subject functional localization methodology has revealed consistent 
          topography across individuals and robust functional selectivity.
        </p>
        <p>
          Credit where due: Fedorenko's own lab has demonstrated that <strong>surprisal strongly 
          modulates activation</strong>—less predictable sentences elicit higher responses. This 
          is crucial evidence. But there's something her paradigm systematically excludes that 
          changes the interpretation entirely.
        </p>
      </Prose>

      <Subsection number="5.1" title="The Open-Loop Problem">
        <Prose>
          <p>
            Drawing on Conant and Ashby's Good Regulator Theorem—"every good regulator of a 
            system must be a model of that system"—we propose the language network is not a 
            static encoder/decoder but a <strong>communicative uncertainty controller</strong>. 
            It manages both linguistic prediction and listener modeling in real-time communication.
          </p>
          <p>
            The critical insight: Fedorenko's paradigm DOES capture <strong>linguistic uncertainty</strong>—the 
            surprisal effects she measures are real. But it removes the <strong>communicative feedback loop</strong>: 
            no listener, no adaptation, no goal-achievement monitoring. <strong>The controller 
            isn't dead—it's running open-loop.</strong>
          </p>
        </Prose>

        <MathBlock>
          {`A = \\beta_1 L + \\beta_2 H(Z)_{ling} + \\beta_3 H(Z)_{comm} + \\beta_4 (L \\times H(Z)_{comm})`}
        </MathBlock>

        <Prose>
          <p>
            Where <Math>{`L`}</Math> is linguistic complexity, <Math>{`H(Z)_{ling}`}</Math> is 
            linguistic surprisal (word predictability), and <Math>{`H(Z)_{comm}`}</Math> is 
            communicative uncertainty—the uncertainty about your listener's state, whether they're 
            understanding, how to adapt. Fedorenko's paradigm measures the first two terms but 
            sets <Math>{`H(Z)_{comm} = 0`}</Math> by design. <strong>She studies the controller, 
            but never lets it close the loop.</strong>
          </p>
        </Prose>

        <SimulationCanvas
          title="Open-Loop vs Closed-Loop Control"
          description="Compare what Fedorenko measures vs what real communication requires."
        >
          {({ width, height }) => (
            <LanguageControllerSim width={width} height={height} />
          )}
        </SimulationCanvas>
      </Subsection>

      <Subsection number="5.2" title="The Missing Activation">
        <Prose>
          <p>
            Consider these scenarios with identical linguistic complexity:
          </p>
          <p>
            <strong>Fedorenko's paradigm:</strong> Read "The doctor examined the patient" in 
            isolation. <Math>{`H(Z)_{comm} = 0`}</Math> (no listener to model).
          </p>
          <p>
            <strong>Real communication:</strong> Explain a medical condition to your anxious 
            grandmother. <Math>{`H(Z)_{comm}`}</Math> is high—you're actively modeling her 
            comprehension, watching for confusion, ready to rephrase.
          </p>
          <p>
            Same linguistic content. But the second condition engages the communicative control 
            system—the part that asks: <em>Is she following? Should I simplify? Did that 
            analogy land?</em> This is the activation Fedorenko's paradigm cannot capture.
          </p>
        </Prose>

        <KeyInsight>
          Fedorenko found a controller. She just doesn't know it because she's never closed 
          the loop. The language network responds to linguistic input because it's built for 
          communicative control—but her paradigm severs the feedback pathway, leaving the 
          controller running open-loop with no target to regulate toward.
        </KeyInsight>
      </Subsection>

      <Subsection number="5.3" title="Reinterpreting Her Findings">
        <Prose>
          <p>
            Crucially, Fedorenko's core findings remain valid—they just support a different 
            conclusion than she draws:
          </p>
          <p>
            <strong>"Surprisal modulates activation"</strong> → Yes, and her own lab proved 
            this! Less predictable sentences drive higher responses. This IS the linguistic 
            uncertainty term <Math>{`H(Z)_{ling}`}</Math> at work.
          </p>
          <p>
            <strong>"Language-selective"</strong> → Optimized for controlling linguistic 
            signals, our primary communicative channel. Domain-specificity is expected for 
            specialized controllers.
          </p>
          <p>
            <strong>"Not needed for thought"</strong> → Controllers aren't needed for planning, 
            only for execution toward a target. You don't need a thermostat to decide what 
            temperature you want.
          </p>
          <p>
            <strong>"Separate from Theory of Mind"</strong> → Yes, but synchronized with it! 
            Fedorenko's own work shows the language and ToM networks are functionally connected 
            during naturalistic comprehension. The controller (language) and the listener-model 
            (ToM) are distinct modules that coordinate during closed-loop communication.
          </p>
          <p>
            This reframing actually <em>strengthens</em> the scale-free intelligence thesis. 
            Language is not doing cognitive heavy lifting—it's a specialized controller for 
            managing communicative uncertainty. Intelligence is fundamentally non-linguistic; 
            language is an evolutionary innovation for sharing predictions across individual 
            Markov blankets. The control loop just hasn't been studied with the loop closed.
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
