import { Section, SectionHeader, Prose, KeyInsight, PageNavigation } from '../components/Section';
import { Bibliography } from '../components/Bibliography';

export function IntroductionPage({ section, prevSection, nextSection, onNavigate, onReadPaper }) {
  return (
    <Section>
      <SectionHeader 
        title={section.title}
        subtitle={section.subtitle}
        isIntro={true}
      />

      <Prose className="text-center max-w-2xl mx-auto">
        <p>
          The question of what constitutes biological intelligence—and whether it 
          operates by common principles from cells to societies—has generated one 
          of the most ambitious theoretical programs in contemporary cognitive science.
        </p>
        <p>
          This synthesis integrates work from mathematical physics, developmental 
          biology, neuroscience, and philosophy to argue that intelligence is not 
          a special property of nervous systems but rather an emergent feature of 
          any self-organizing system that maintains statistical boundaries with 
          its environment.
        </p>
      </Prose>

      {/* Read Paper Button */}
      <div className="flex justify-center my-10">
        <button
          onClick={onReadPaper}
          className="btn btn-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Read Full Paper
        </button>
      </div>

      <KeyInsight>
        Free energy minimization, implemented through nested Markov blankets, 
        provides the mathematical scaffolding that unifies morphogenesis, 
        homeostatic regulation, neural computation, and conscious experience 
        under a single explanatory framework.
      </KeyInsight>

      <Prose className="text-center max-w-2xl mx-auto mt-8">
        <p>
          The core insight can be stated simply: <em>to exist as a distinguishable 
          entity is to infer</em>—that is, to model and predict one's environment 
          in ways that preserve structural and functional integrity. From unicellular 
          organisms navigating chemical gradients to human beings constructing 
          autobiographical narratives, the computational principles remain invariant 
          even as their implementation substrates differ dramatically.
        </p>
      </Prose>

      <div className="mt-16 pt-8 border-t border-border">
        <h3 className="font-display text-lg text-text mb-4">What You'll Explore</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-deep rounded-lg border border-border">
            <div className="font-mono text-xs text-muted mb-1">Sections 1-4</div>
            <div className="text-text">Mathematical & Biological Foundations</div>
            <div className="text-muted mt-1">Free energy, bioelectricity, homeostasis, autopoiesis</div>
          </div>
          <div className="p-4 bg-deep rounded-lg border border-border">
            <div className="font-mono text-xs text-muted mb-1">Sections 5-8</div>
            <div className="text-text">Neural Implementation</div>
            <div className="text-muted mt-1">Language, effort, configuration, predictions</div>
          </div>
          <div className="p-4 bg-deep rounded-lg border border-border">
            <div className="font-mono text-xs text-muted mb-1">Sections 9-10</div>
            <div className="text-text">Scale & Consciousness</div>
            <div className="text-muted mt-1">Nested hierarchies, meta-modeling</div>
          </div>
          <div className="p-4 bg-deep rounded-lg border border-border">
            <div className="font-mono text-xs text-muted mb-1">Sections 11-12</div>
            <div className="text-text">Critique & Synthesis</div>
            <div className="text-muted mt-1">Open questions, unified picture</div>
          </div>
        </div>
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
