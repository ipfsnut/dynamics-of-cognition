import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math, MathBlock } from '../components/Math';
import { SimulationCanvas } from '../components/SimulationCanvas';
import { Bibliography } from '../components/Bibliography';
import { AnnealingSim } from '../components/simulations/AnnealingSim';
import { EnergyAffordanceSim } from '../components/simulations/EnergyAffordanceSim';

export function ConfigurationPage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          The preceding framework establishes that self-organizing systems minimize free 
          energy through nested Markov blankets, and Section 6 showed how Holroyd's 
          controllosphere provides the <em>neural implementation</em>—DLPFC driving states 
          into metabolically costly regions, ACC monitoring prediction error, waste accumulation 
          enforcing limits. What remains is to formalize the <em>structure</em> of the constraint 
          itself: why certain thoughts are accessible to an organism at a given moment while 
          others remain unreachable.
        </p>
        <p>
          The concept of <strong>annealing</strong>, imported from statistical physics, provides 
          the missing mechanism: cognition is not computation happening "in" a body but rather 
          the body's current configuration expressing itself, with thoughts constrained to 
          trajectories the whole system can actually traverse.
        </p>
      </Prose>

      <Subsection number="7.1" title="Dynamical Systems Ground Cognition in Configuration Space">
        <Prose>
          <p>
            Tim van Gelder's landmark 1995 paper articulates what he calls the <em>dynamical 
            hypothesis</em>: cognition is not <em>like</em> a dynamical system—it IS one. 
            Cognitive states are positions in state space; cognitive processes are trajectories 
            through that space. This is not metaphor but literal claim about the ontology of mind.
          </p>
          <p>
            J.A. Scott Kelso's coordination dynamics demonstrates this concretely. His work 
            on <strong>metastability</strong> shows that stable cognitive patterns correspond 
            to <em>attractors</em>—regions of state space the system tends to occupy. When 
            parameters shift, the system can suddenly access previously unreachable configurations. 
            Metastable systems can transition between configurations without being locked into 
            any single attractor—but this capacity exists only within a narrow parameter range 
            near bifurcation points.
          </p>
          <p>
            Esther Thelen and Linda Smith's developmental work provides compelling empirical 
            grounding. Their Dynamic Field Theory shows how infant cognition emerges from 
            whole-body dynamics. As they emphasize, <strong>"the brain is not the 'controller' 
            of behavior"</strong>—one must understand how brain capitalizes on body dynamics 
            and how body informs brain.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="7.2" title="The Body as Configuration Space">
        <Prose>
          <p>
            The critical extension is recognizing that the relevant configuration space is 
            <strong>the entire body</strong>, not merely neural state space. At any moment, 
            the organism occupies a point in an extraordinarily high-dimensional space comprising: 
            neural firing patterns, neurotransmitter concentrations, hormonal profiles, 
            autonomic nervous system state, immune system activation, metabolic states, 
            bioelectric gradients, muscle tension distributions, interoceptive signals, and 
            respiratory and cardiac rhythms.
          </p>
        </Prose>

        <MathBlock>
          {`\\frac{dx}{dt} = f(x) + \\omega`}
        </MathBlock>

        <Prose>
          <p>
            The Langevin dynamics governing Markov blanket systems incorporate precisely this 
            structure. The deterministic flow <Math>{`f(x)`}</Math> pulls states toward attractors; 
            the stochastic term <Math>{`\\omega`}</Math> provides thermal fluctuation enabling escape 
            from local minima. The balance between these terms determines the system's 
            <strong> effective temperature</strong> and thus its exploratory versus exploitative character.
          </p>
          <p>
            <strong>A thought is not retrieved from storage but is rather a trajectory through 
            this space that the system can actually traverse</strong> given its current configuration. 
            The thought does not exist as a suppressed or filtered representation; the configuration 
            that would constitute that thought simply cannot be achieved.
          </p>
          <p>
            This is what Section 6's controllosphere makes concrete at the neural level. The 
            <em>intrinsic manifold</em> represents configurations the system can sustain cheaply; 
            the <em>controllosphere</em> represents configurations that require continuous metabolic 
            expenditure to maintain. The waste accumulation Holroyd describes is the body's signal 
            that a configuration is being held open that the system cannot naturally support.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Configuration Constraint: Annealing Dynamics"
          description="Adjust temperature to see how configurations become accessible or trapped. Click to relocate."
        >
          {({ width, height }) => (
            <AnnealingSim width={width} height={height} />
          )}
        </SimulationCanvas>
      </Subsection>

      <Subsection number="7.3" title="Radical Embodiment: The Identity Claim">
        <Prose>
          <p>
            The <em>radical</em> embodied cognition thesis—distinct from weaker claims that 
            "the body influences thought"—holds that cognition IS bodily activity. Anthony 
            Chemero defines this position: "cognition is to be described in terms of agent-environment 
            dynamics, and not in terms of computation and representation." This is explicitly 
            anti-representationalist.
          </p>
          <p>
            The enactivist tradition makes the constitutive claim: cognition is not the 
            representation of a pre-given world by a pre-given mind but rather the <strong>enactment</strong> 
            of a world and a mind on the basis of a history of actions. Alva Noë pushes further: 
            "Perception is not a process in the brain, but a kind of skillful activity of the 
            body as a whole. <strong>We enact our perceptual experience.</strong>"
          </p>
          <p>
            Gibson's ecological psychology grounds this in perception. Affordances—what the 
            environment offers the animal—exist only relative to the organism's bodily capabilities. 
            If perception requires bodily engagement with affordances, and cognition emerges 
            from perception-action cycles, then cognition cannot exceed what the body can configure.
          </p>
        </Prose>

        <KeyInsight>
          This is not dualism (mind and body as interacting substances) nor standard embodied 
          cognition (mind as shaped by bodily metaphors). It is <strong>identity</strong>: the 
          thought IS the configuration. The apparent distinction between "having a thought" and 
          "being in a bodily state" is an artifact of introspection, not a feature of the system.
        </KeyInsight>
      </Subsection>

      <Subsection number="7.4" title="Autonomic State Constrains Psychological Possibility">
        <Prose>
          <p>
            Stephen Porges's polyvagal theory provides the clinical bridge between bodily 
            configuration and cognitive access. His central claim is direct: <strong>"physiological 
            state limits the range of behavior and psychological experience."</strong> This is 
            not merely influence but constraint—when the autonomic nervous system enters dorsal 
            vagal shutdown, social engagement cognition is not merely unlikely but structurally 
            unavailable.
          </p>
          <p>
            The theory describes a hierarchical autonomic system with three primary states: 
            <em>ventral vagal</em> (social engagement, calm presence, higher cognitive access), 
            <em>sympathetic activation</em> (fight/flight, threat-focused processing), and 
            <em>dorsal vagal</em> (immobilization, shutdown, severe cognitive restriction). 
            The concept of <strong>neuroception</strong>—a neural process that assesses safety 
            before cognitive awareness—establishes that the body determines available cognitive 
            states pre-reflectively.
          </p>
          <p>
            Pat Ogden's <strong>window of tolerance</strong> operationalizes this clinically. 
            Outside the window—in hyperarousal or hypoarousal—individuals become "cognitively 
            disabled." This is not metaphor: integration and flexible cognition become impossible 
            when the body is configured for survival rather than engagement.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="7.5" title="Trauma as Frozen Configuration">
        <Prose>
          <p>
            Peter Levine's somatic experiencing framework describes trauma as precisely what 
            the thesis predicts: <strong>frozen bodily configuration that constrains psychological 
            possibility</strong>. In traumatic events, people are unable to complete initiated 
            defensive reactions, leading to persistent somatic and emotional dysregulation. 
            The body is literally stuck in an incomplete action sequence—a frozen configuration 
            that determines which cognitive/emotional states can emerge.
          </p>
          <p>
            Traumatic memory is not stored representation but <strong>embodied configuration</strong>—patterns 
            of muscle tension, autonomic reactivity, hormonal setpoints, and neural connectivity 
            that constitute ongoing threat-response. Thoughts and perceptions consistent with 
            safety are inaccessible because the body is not configured for safety. The system 
            has been <em>quenched</em>—cooled too rapidly from a high-energy state, freezing 
            in a disordered, high-vigilance configuration rather than settling into an integrated, 
            low-energy attractor.
          </p>
          <p>
            Van der Kolk's empirical work provides the strongest evidence. His 2014 randomized 
            controlled trial of yoga for treatment-resistant PTSD found that <strong>52% of the 
            yoga group no longer met PTSD criteria</strong> versus 21% of controls. Critically, 
            participants had already had more than 3 years of prior treatment—talk therapy had 
            failed. The body-based intervention enabled cognitive/emotional changes that 
            cognition-based approaches could not access because the configuration itself had 
            to change first.
          </p>
        </Prose>

        <KeyInsight>
          This reframes therapeutic intervention. Talk therapy attempts to change cognition 
          within the current configuration—but if the configuration constrains which thoughts 
          are accessible, this approach faces fundamental limits. Somatic therapies change 
          the landscape rather than navigating within it.
        </KeyInsight>
      </Subsection>

      <Subsection number="7.6" title="Precision as Bodily Temperature">
        <Prose>
          <p>
            The Free Energy Principle provides the formal machinery connecting bodily state 
            to cognitive possibility. In predictive processing, <strong>precision</strong> functions 
            as gain on prediction errors—determining which signals get amplified versus suppressed. 
            Precision is implemented through neuromodulation (dopamine, norepinephrine, serotonin) 
            and synaptic mechanisms—bodily processes.
          </p>
          <p>
            High precision means peaked distributions, rigid inference, exploitation of current 
            beliefs. Low precision means flat distributions, flexible inference, exploration of 
            alternatives. The body's current precision state—its neuromodulatory configuration—literally 
            determines which prediction errors can register in consciousness and update beliefs.
          </p>
          <p>
            This maps directly onto the controllosphere architecture from Section 6. <strong>ACC 
            monitors precision-weighted prediction errors</strong>—it tracks whether the current 
            mapping is "working" in the sense of reducing expected free energy. <strong>DLPFC 
            provides the metabolic push</strong> to maintain mappings that require elevated precision 
            to sustain. The "effort" of cognitive control is precisely the cost of maintaining 
            non-default precision settings.
          </p>
          <p>
            Lisa Feldman Barrett's work on allostasis grounds this in metabolic reality: 
            metabolism and energy regulation may be at the core of the human mind. Depression 
            exemplifies this: Barrett describes it as a disorder of allostasis, whose symptoms 
            result from a "locked in" brain relatively insensitive to its sensory context. 
            A body that cannot allocate metabolic resources to reconfiguration cannot think differently.
          </p>
          <p>
            Robin Carhart-Harris's REBUS model provides direct demonstration. Psychedelics 
            pharmacologically reduce precision-weighting of high priors, "liberating bottom-up 
            information flow." The result is what Carhart-Harris calls "flattening of the 
            free-energy landscape"—the annealing metaphor made biochemically literal. The 
            chemical intervention changes bodily configuration (serotonin receptor binding → 
            precision reduction → landscape flattening), which enables thoughts that were 
            previously impossible.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="7.7" title="The One-Body Principle">
        <Prose>
          <p>
            The organism has only one body. This seems trivially true but has non-obvious 
            implications. Because neural states must be consistent with achievable bodily states, 
            <strong>what cannot be configured cannot be thought</strong>. This is not a filtering 
            mechanism—it is an ontological constraint. There is no "thought" independent of the 
            configuration that constitutes it.
          </p>
          <p>
            This generates predictions categorically different from both computationalism 
            and standard embodied cognition:
          </p>
          <p>
            <strong>Prediction 1:</strong> Somatic interventions should produce cognitive changes 
            unreachable through reflection alone—<em>confirmed by van der Kolk's yoga studies</em>.
          </p>
          <p>
            <strong>Prediction 2:</strong> Cognitive accessibility should correlate with 
            physiological state—<em>consistent with window of tolerance research</em>.
          </p>
          <p>
            <strong>Prediction 3:</strong> Trauma should exhibit hysteresis: getting IN is 
            easier than getting OUT—<em>confirmed by the chronicity of PTSD and treatment resistance</em>.
          </p>
          <p>
            <strong>Prediction 4:</strong> Pharmacological manipulation of precision should 
            alter cognitive flexibility—<em>confirmed by psychedelic research</em>.
          </p>
          <p>
            <strong>Prediction 5:</strong> Belief change requiring autonomic/endocrine 
            reconfiguration should be harder than belief change within current configuration—<em>testable 
            through intervention studies</em>.
          </p>
        </Prose>

        <KeyInsight>
          Cognition is not computation plus embodiment—it is configuration. The thought IS the 
          configuration. Perception is not processing of information but achievement of configuration.
        </KeyInsight>
      </Subsection>

      <Subsection number="7.8" title="Formalizing the Constraint: H(ω)">
        <Prose>
          <p>
            The insights above can be synthesized into a formal statement. Drawing on four 
            traditions—Kelso's coordination dynamics, Barrett's interoceptive inference, 
            hierarchical reinforcement learning's <strong>Options framework</strong> (Sutton, 
            Precup, & Singh, 1999), and Holroyd's controllosphere—we propose:
          </p>
        </Prose>

        <MathBlock>
          {`H(\\omega) = \\{h \\in H : \\omega \\in I_h\\}`}
        </MathBlock>

        <Prose>
          <p>
            Where <Math>{`\\Omega`}</Math> is the space of body configurations, <Math>{`\\omega \\in \\Omega`}</Math> is 
            the current configuration, <Math>{`H`}</Math> is the full space of possible interpretive/action 
            mappings, <Math>{`I_h`}</Math> is the <em>initiation set</em> for mapping h—the configurations 
            that support its instantiation—and <Math>{`H(\\omega)`}</Math> is the subset accessible at configuration ω.
          </p>
          <p>
            This formalizes "what cannot be configured cannot be thought" with precision. 
            A mapping h is accessible at configuration ω <strong>if and only if</strong> ω 
            is in h's initiation set.
          </p>
        </Prose>

        <KeyInsight title="The Four-Way Synthesis">
          <p>
            <strong>From HKB:</strong> The bifurcation mechanism. Body parameters can eliminate 
            stable states entirely through saddle-node bifurcations—categorical elimination, 
            not probabilistic weighting.
          </p>
          <p>
            <strong>From Barrett's EPIC:</strong> The scope. The "locked in" brain concept captures 
            categorical inaccessibility. Interoception is constitutive of concept construction.
          </p>
          <p>
            <strong>From the Options framework:</strong> The notation. An option is available 
            in state s iff s ∈ I. We extend: mapping h is available at ω iff ω ∈ I<sub>h</sub>.
          </p>
          <p>
            <strong>From Holroyd's controllosphere:</strong> The neural implementation. Intrinsic 
            manifold = H(ω); controllosphere = h ∉ H(ω). DLPFC pays the metabolic cost of holding 
            ω in regions that support otherwise-inaccessible mappings. Waste accumulation = the 
            body enforcing the constraint.
          </p>
        </KeyInsight>

        <Prose>
          <p>
            <strong>The critical distinction:</strong> H(ω) differs from precision-weighting. 
            Precision assigns weight to hypotheses within a fixed space—even very low precision 
            keeps a hypothesis mathematically available. H(ω) removes hypotheses from the space 
            entirely for certain configurations. This is the difference between a radio station 
            at very low volume versus outside the receiver's frequency range.
          </p>
          <p>
            The controllosphere provides the <em>why</em>: accessing h ∉ H(ω) requires continuous 
            metabolic expenditure because you're fighting the natural basin of attraction. The 
            system is designed to return to the intrinsic manifold—to H(ω)—and resists excursions 
            into the controllosphere precisely because they are unsustainable. Learning expands 
            initiation sets; fatigue is the body's signal that initiation sets are being violated.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="7.9" title="Configuration Has Costs">
        <Prose>
          <p>
            The preceding framework establishes <em>what</em> configuration constrains—which 
            mappings are accessible. But there's a deeper question: <em>why</em> do these 
            constraints exist? The answer lies in thermodynamics. <strong>Configuration space 
            isn't freely navigable—it's a landscape with metabolic costs.</strong>
          </p>
          <p>
            The brain consumes approximately <strong>20 watts</strong>—20% of resting metabolic 
            output for 2% of body mass. The Na⁺/K⁺-ATPase pump alone, which maintains the ion 
            gradients enabling action potentials, consumes 55-75% of total brain ATP. Every 
            configuration requires continuous energy expenditure to maintain.
          </p>
          <p>
            The most striking finding: <strong>communication costs 35 times more than computation</strong>. 
            Synaptic transmission and action potential propagation demand ~4.6 watts; cortical 
            computation requires only ~0.2 watts. This forces fewer than 1% of cortical neurons 
            to be substantially active concurrently. Sparse coding is thermodynamic necessity, 
            not design choice.
          </p>
          <p>
            This grounds Holroyd's controllosphere in physics. The <em>intrinsic manifold</em> 
            represents configurations the system can sustain within normal ATP budget. The 
            <em>controllosphere</em> represents configurations requiring continuous metabolic 
            expenditure beyond baseline. DLPFC "holds open" configurations by paying metabolic 
            costs. The waste accumulation Holroyd describes—adenosine, lactate—signals that 
            the system is operating beyond sustainable limits.
          </p>
          <p>
            Recent work in <strong>stochastic thermodynamics</strong> reveals a deeper connection. 
            Friston's variational free energy and thermodynamic free energy share the structural 
            form F = Energy - Entropy. Path integrals connect belief updating to heat dissipation 
            via fluctuation theorems. The prediction-efficiency equivalence discovered by Still 
            et al. (2012) shows that nonpredictive information—model complexity that doesn't 
            improve prediction—equals thermodynamic inefficiency. Systems optimized for energy 
            efficiency must be optimized for prediction.
          </p>
          <p>
            The phenomenology of mental fatigue reflects genuine thermodynamic reality. Extended 
            demanding cognition depletes local glycogen stores; ATP regeneration can't keep pace 
            with consumption; adenosine accumulates as a waste product of ATP breakdown. The 
            contracted <Math>{`H(\\omega)`}</Math> of exhaustion isn't psychological weakness—it's 
            thermodynamic necessity. Certain configurations become literally unsustainable.
          </p>
        </Prose>

        <SimulationCanvas 
          title="Energy & Affordances"
          description="Watch the cognitive horizon contract as ATP depletes. Expensive thoughts (⚡⚡⚡) become inaccessible first. Rest to recover."
        >
          {({ width, height }) => (
            <EnergyAffordanceSim width={width} height={height} />
          )}
        </SimulationCanvas>

        <KeyInsight title="The Thermodynamic Grounding">
          <Math>{`H(\\omega)`}</Math> isn't just about what's computationally possible—it's 
          about what's metabolically sustainable. Some configurations drain reserves faster 
          than others. Fatigue progressively eliminates configurations by metabolic exclusion. 
          Recovery expands <Math>{`H(\\omega)`}</Math> by restoring thermodynamic feasibility. 
          The body doesn't just <em>implement</em> cognition—it <em>fuels</em> it.
        </KeyInsight>
      </Subsection>

      <div className="mt-12 p-6 bg-surface/50 rounded-lg border border-border">
        <h3 className="text-lg font-mono text-glow mb-3">Further Reading</h3>
        <p className="text-sm text-muted mb-4">
          Extended theoretical documents developing the H(ω) formalization and its grounding:
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <a 
              href="#/doc/h-omega-synthesis"
              className="text-glow hover:underline"
            >
              H(ω): The Configuration Constraint on Cognitive Accessibility
            </a>
            <span className="text-muted ml-2">— Full formal synthesis with literature review</span>
          </li>
          <li>
            <a 
              href="#/doc/configuration-dynamics"
              className="text-glow hover:underline"
            >
              Configuration Dynamics: The Metabolic Architecture of Flexible Cognition
            </a>
            <span className="text-muted ml-2">— Working document on PFC as mapping-switcher</span>
          </li>
          <li>
            <a 
              href="#/doc/thermodynamic-grounding"
              className="text-glow hover:underline"
            >
              The Thermodynamic Grounding of Cognitive Configuration
            </a>
            <span className="text-muted ml-2">— How Gibbs free energy constrains H(ω)</span>
          </li>
        </ul>
      </div>

      <Bibliography referenceIds={section.references} />
      
      <PageNavigation 
        prevSection={prevSection}
        nextSection={nextSection}
        onNavigate={onNavigate}
      />
    </Section>
  );
}
