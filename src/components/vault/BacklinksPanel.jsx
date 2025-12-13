import { useNavigate } from 'react-router-dom';

export default function BacklinksPanel({ backlinks, notes }) {
  const navigate = useNavigate();

  if (!backlinks || backlinks.length === 0) {
    return (
      <div className="bg-surface/30 rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Backlinks</h3>
        <p className="text-xs text-secondary italic">No notes link to this one yet.</p>
      </div>
    );
  }

  const handleNoteClick = (noteId) => {
    navigate(`/vault/${noteId}`);
  };

  return (
    <div className="bg-surface/30 rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Backlinks ({backlinks.length})
      </h3>
      <div className="space-y-2">
        {backlinks.map((linkInfo) => {
          const sourceNote = notes[linkInfo.source];
          if (!sourceNote) return null;

          return (
            <button
              key={linkInfo.source}
              onClick={() => handleNoteClick(linkInfo.source)}
              className="w-full text-left p-2 rounded hover:bg-surface/50 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
                  style={{ background: getFolderColor(sourceNote.folder) }}
                ></div>
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {sourceNote.title}
                </span>
              </div>
              <p className="text-xs text-secondary leading-relaxed ml-3.5">
                {sourceNote.excerpt}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getFolderColor(folder) {
  const colors = {
    canonical: '#3b82f6',
    concepts: '#8b5cf6', 
    research: '#10b981',
    evidence: '#f59e0b',
    meta: '#6b7280'
  };
  return colors[folder] || '#9ca3af';
}