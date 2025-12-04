/**
 * Section - Main container for a page section
 */
export function Section({ children, className = '' }) {
  return (
    <section className={`${className}`}>
      {children}
    </section>
  );
}

/**
 * SectionHeader - Title and subtitle for a section
 */
export function SectionHeader({ number, title, subtitle, isIntro, isSynthesis }) {
  if (isIntro) {
    return (
      <header className="text-center mb-12">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-glow font-light leading-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted font-light">
            {subtitle}
          </p>
        )}
      </header>
    );
  }
  
  return (
    <header className="mb-10">
      {number && (
        <div className="font-mono text-sm text-muted mb-2">
          Section {number.toString().padStart(2, '0')}
        </div>
      )}
      <h2 className={`font-display text-2xl sm:text-3xl md:text-4xl font-light leading-tight ${isSynthesis ? 'text-glow' : 'text-text'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted mt-2 font-light">
          {subtitle}
        </p>
      )}
    </header>
  );
}

/**
 * Subsection - Subsection within a section
 */
export function Subsection({ number, title, children }) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="font-display text-xl sm:text-2xl text-text/90 mb-4">
        {number && (
          <span className="font-mono text-base text-muted mr-2">{number}</span>
        )}
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * Prose - Body text container
 */
export function Prose({ children, className = '' }) {
  return (
    <div className={`prose-content space-y-4 text-text/80 leading-relaxed ${className}`}>
      {children}
    </div>
  );
}

/**
 * KeyInsight - Highlighted callout for key insights
 */
export function KeyInsight({ children }) {
  return (
    <div className="key-insight">
      {children}
    </div>
  );
}

/**
 * PageNavigation - Prev/Next navigation at bottom of page
 */
export function PageNavigation({ prevSection, nextSection, onNavigate }) {
  return (
    <div className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center justify-between gap-4">
        {prevSection ? (
          <button
            onClick={() => onNavigate(prevSection)}
            className="btn btn-ghost text-left flex-1 max-w-xs"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="truncate">
              <span className="block text-xs text-muted">Previous</span>
              <span className="block">{prevSection.title}</span>
            </span>
          </button>
        ) : (
          <div />
        )}
        
        {nextSection ? (
          <button
            onClick={() => onNavigate(nextSection)}
            className="btn btn-ghost text-right flex-1 max-w-xs justify-end"
          >
            <span className="truncate">
              <span className="block text-xs text-muted">Next</span>
              <span className="block">{nextSection.title}</span>
            </span>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
