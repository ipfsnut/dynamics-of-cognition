import { Section, SectionHeader, Subsection, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Math } from '../components/Math';
import { Bibliography } from '../components/Bibliography';

export function CritiquePage({ section, prevSection, nextSection, onNavigate }) {
  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
      />

      <Prose>
        <p>
          The theoretical program outlined here has attracted substantial criticism, 
          which illuminates both limitations and opportunities for refinement. A framework 
          worth taking seriously must be worth criticizing seriously.
        </p>
      </Prose>

      <Subsection number="11.1" title="The Emperor's New Markov Blankets">
        <Prose>
          <p>
            The most systematic critique distinguishes <strong>Pearl blankets</strong>—the 
            original epistemic use of Markov blankets for Bayesian inference—from 
            <strong>Friston blankets</strong>—the metaphysical use to demarcate physical 
            boundaries between agents and environments.
          </p>
          <p>
            Critics charge reification fallacy: "attributing to the territory what is a 
            property of the map." This critique, while technically sophisticated, may assume 
            a sharp map/territory distinction that is precisely what FEP calls into question. 
            The more substantive issue is not whether blankets are "real" but which blanket 
            decomposition is explanatorily relevant for which purposes.
          </p>
          <p>
            <strong>Response:</strong> The framework does not claim that Markov blankets 
            are observer-independent features of reality. It claims that certain decompositions 
            are <em>more useful</em> for understanding self-organizing systems, and that 
            the boundary dynamics at those decompositions have causal and phenomenal significance.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="11.2" title="The Unfalsifiability Critique">
        <Prose>
          <p>
            Friston himself acknowledges that FEP is a principle, not an empirical hypothesis: 
            "Like Hamilton's principle of stationary action, it cannot be falsified." The 
            defense is that FEP generates testable process theories (predictive coding, 
            active inference) even if the principle itself transcends empirical test.
          </p>
          <p>
            <strong>Response:</strong> The distinction between unfalsifiable principles and 
            falsifiable implementations is philosophically respectable. Newton's laws cannot 
            be falsified in isolation, but specific applications can be. The question is 
            whether FEP's implementations make distinctive, testable predictions—which the 
            <Math>{`H(\\omega)`}</Math> formalization attempts to provide.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="11.3" title="Is H(ω) Empirically Distinguishable from Precision-Weighting?">
        <Prose>
          <p>
            The sharpest objection to <Math>{`H(\\omega)`}</Math>: perhaps it adds nothing 
            beyond standard precision-weighting. If "categorical exclusion" is just "extremely 
            low precision," the framework is a notational variant, not a substantive advance.
          </p>
          <p>
            <strong>Response:</strong> The distinction is mathematically precise. Precision 
            assigns weight within a fixed hypothesis space—even a hypothesis with precision 
            approaching zero remains in the space and can, in principle, be reconsidered 
            given sufficient evidence. <Math>{`H(\\omega)`}</Math> removes hypotheses from 
            the space entirely: no amount of evidence can make you consider a hypothesis 
            that isn't in <Math>{`H(\\omega)`}</Math> because the configuration that would 
            support considering it isn't achievable.
          </p>
          <p>
            The empirical test: find cases where precision-weighting predicts a hypothesis 
            should be reconsidered given evidence, but <Math>{`H(\\omega)`}</Math> predicts 
            it cannot be until configuration changes. Psychedelic-assisted therapy may 
            provide such cases: insights become accessible not because evidence quality 
            improves but because the configuration changes.
          </p>
        </Prose>

        <KeyInsight>
          The radio frequency metaphor makes the distinction vivid: turning down the volume 
          (precision) keeps the station receivable in principle; changing the frequency 
          range (<Math>{`H(\\omega)`}</Math>) makes certain stations categorically inaccessible 
          regardless of volume settings.
        </KeyInsight>
      </Subsection>

      <Subsection number="11.4" title="The Boundary Problem">
        <Prose>
          <p>
            What counts as part of <Math>{`\\omega`}</Math>? The configuration constraint 
            claims cognition depends on "whole-body configuration"—but where does the body 
            end? Does <Math>{`\\omega`}</Math> include gut microbiome state? Hormones from 
            food consumed? Social context as mediated through bodily response?
          </p>
          <p>
            <strong>Response:</strong> This is a feature, not a bug. The boundary of 
            <Math>{`\\omega`}</Math> is an empirical question, not a definitional one. 
            Whatever variables causally constrain which mappings are accessible are, by 
            definition, part of <Math>{`\\omega`}</Math>. The research program is to 
            discover these variables, not to stipulate them a priori.
          </p>
          <p>
            Emerging evidence suggests <Math>{`\\omega`}</Math> may extend surprisingly 
            far: the gut-brain axis, social co-regulation of autonomic states, environmental 
            affordances. The framework accommodates an extended <Math>{`\\omega`}</Math> 
            without difficulty.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="11.5" title="Computational Tractability">
        <Prose>
          <p>
            Can initiation sets <Math>{`I_h`}</Math> actually be specified? The space 
            <Math>{`\\Omega`}</Math> of body configurations is astronomical. Specifying 
            which configurations support which mappings seems computationally intractable.
          </p>
          <p>
            <strong>Response:</strong> The organism doesn't need to compute initiation 
            sets explicitly; it needs only to <em>embody</em> them. The structure of 
            <Math>{`I_h`}</Math> is implicit in the physics of the system. The controllosphere 
            framework shows how: mappings in <Math>{`H(\\omega)`}</Math> are cheap to 
            instantiate; mappings outside it require metabolic expenditure. The "computation" 
            is performed by the body's energy landscape, not by explicit representation.
          </p>
          <p>
            For scientific purposes, initiation sets can be characterized statistically: 
            "mapping h is accessible from approximately these regions of configuration space, 
            as measured by HRV, cortisol, etc." Full specification isn't required; useful 
            approximation is.
          </p>
        </Prose>
      </Subsection>

      <Subsection number="11.6" title="The Hard Problem Reconsidered">
        <Prose>
          <p>
            The "hard problem" of consciousness assumes that physical processes and phenomenal 
            experience are distinct explananda requiring a bridging explanation. The framework 
            developed here challenges this assumption. If feelings just ARE what self-referential 
            interface modeling IS at sufficient complexity, there is no gap requiring a bridge.
          </p>
          <p>
            Critics will object: why should self-referential interface modeling feel like 
            anything? But this presupposes the framework being rejected. Phenomenal character 
            is not an additional property beyond structural-dynamical properties—it's what 
            certain configurations ARE from inside. The redness of red, the painfulness of 
            pain—these are features to be mapped, not mysteries requiring new ontological categories.
          </p>
          <p>
            This is not eliminativism. We're not denying that feelings exist. We're denying 
            that their existence requires explanation in terms of something more fundamental 
            than the biology of nested self-referential systems.
          </p>
        </Prose>

        <KeyInsight>
          The hard problem dissolves—not by being solved but by being revealed as an 
          artifact of dualistic framing that the biology of feeling renders obsolete. 
          The question becomes empirical: which interface configurations produce which 
          phenomenal signatures, and how do lower-level feelings converge into higher-level experience?
        </KeyInsight>
      </Subsection>

      <Subsection number="11.7" title="Remaining Gaps">
        <Prose>
          <p>
            Even with these responses, genuine questions remain:
          </p>
          <p>
            The <strong>standards for attributing cognition</strong> across biological scales 
            require refinement—critics argue there is "no irrefutable evidence that what is 
            being called 'learning' or 'memory' in non-neuronal organisms is remotely similar 
            to what cognitive scientists are interested in." The framework predicts continuity; 
            the evidence for that continuity remains contested.
          </p>
          <p>
            The mechanisms by which <strong>experience-dependent development</strong> produces 
            consistent neural organization demand explanation—why does language localize so 
            similarly across individuals if it's learned from input? The configuration constraint 
            framework suggests answers involving shared bodily architecture, but the details 
            require specification.
          </p>
          <p>
            The <strong>scaling problem</strong>—how bioelectric cellular dynamics connect 
            mechanistically to neural dynamics—needs detailed specification. The mathematical 
            principles may be scale-invariant, but the implementation details matter.
          </p>
          <p>
            Some apparent problems dissolve on closer inspection. The <strong>individuation 
            of mappings</strong>—what counts as one mapping versus two?—initially seems 
            troubling, but the affordance framing (Section 10.4) reframes the question. 
            We don't count affordances; we characterize affordance fields. Similarly, 
            <Math>{`H(\\omega)`}</Math> isn't a set of discrete items to be enumerated but 
            a structure of cognitive possibilities opened by configuration. The grain of 
            description is set by explanatory purpose, not by facts about individuation.
          </p>
          <p>
            Yet the convergence of mathematical physics, developmental biology, neuroscience, 
            and philosophy on shared principles represents significant theoretical progress. 
            Intelligence, on this account, is not a mysterious addition to the physical world 
            but an inevitable consequence of the statistical mechanics of persistence—and 
            cognition is what self-maintaining systems do when modeling their own affordance 
            fields becomes adaptive.
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
