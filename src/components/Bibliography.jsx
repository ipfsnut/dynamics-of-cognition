import references from '../data/references.json';

/**
 * Bibliography - Renders references for a section
 */
export function Bibliography({ referenceIds = [] }) {
  if (!referenceIds || referenceIds.length === 0) {
    return null;
  }
  
  // Get reference objects, filtering out any not found
  const refs = referenceIds
    .map(id => references[id])
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by first author's last name, then year
      const aName = a.authors[0]?.split(',')[0] || '';
      const bName = b.authors[0]?.split(',')[0] || '';
      if (aName !== bName) return aName.localeCompare(bName);
      return a.year - b.year;
    });

  if (refs.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="font-display text-xl text-text mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        References
      </h3>
      
      <div className="space-y-3">
        {refs.map(ref => (
          <ReferenceItem key={ref.id} reference={ref} />
        ))}
      </div>
    </div>
  );
}

/**
 * ReferenceItem - Single reference entry
 */
function ReferenceItem({ reference }) {
  const { authors, year, title, journal, volume, issue, pages, publisher, doi, url, type } = reference;
  
  // Format authors: "Last, F., Last, F., & Last, F."
  const authorString = formatAuthors(authors);
  
  // Build the citation
  const isBook = type === 'book';
  
  return (
    <div className="reference-item">
      <div className="reference-authors">
        {authorString} ({year}).
      </div>
      <div className="reference-title mt-1">
        {title}{!isBook && '.'}
      </div>
      {isBook ? (
        <div className="reference-journal mt-1">
          {publisher}.
        </div>
      ) : (
        <div className="reference-journal mt-1">
          {journal && <em>{journal}</em>}
          {volume && <>, {volume}</>}
          {issue && <>({issue})</>}
          {pages && <>, {pages}</>}
          {journal && '.'}
        </div>
      )}
      {(doi || url) && (
        <div className="mt-2">
          {doi && (
            <a 
              href={`https://doi.org/${doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-glow/70 hover:text-glow font-mono"
            >
              doi:{doi}
            </a>
          )}
          {!doi && url && (
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-glow/70 hover:text-glow"
            >
              {url}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Format author list in APA style
 */
function formatAuthors(authors) {
  if (!authors || authors.length === 0) return '';
  
  if (authors.length === 1) {
    return authors[0];
  }
  
  if (authors.length === 2) {
    return `${authors[0]} & ${authors[1]}`;
  }
  
  // More than 2: show first author et al.
  if (authors.length > 7) {
    return `${authors[0]} et al.`;
  }
  
  // 3-7 authors: list all with & before last
  const allButLast = authors.slice(0, -1).join(', ');
  const last = authors[authors.length - 1];
  return `${allButLast}, & ${last}`;
}

/**
 * Cite - Inline citation component (for future use)
 */
export function Cite({ id, children }) {
  const ref = references[id];
  
  if (!ref) {
    console.warn(`Reference not found: ${id}`);
    return <span className="text-red-400">[{id}?]</span>;
  }
  
  const firstAuthor = ref.authors[0]?.split(',')[0] || 'Unknown';
  const label = ref.authors.length > 2 
    ? `${firstAuthor} et al., ${ref.year}`
    : ref.authors.length === 2
    ? `${firstAuthor} & ${ref.authors[1]?.split(',')[0]}, ${ref.year}`
    : `${firstAuthor}, ${ref.year}`;
  
  return (
    <span 
      className="text-glow/80 hover:text-glow cursor-help"
      title={ref.title}
    >
      {children || `(${label})`}
    </span>
  );
}
