import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WikiLink({ target, display, notes }) {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const targetNote = notes ? notes[target] : null;
  const linkText = display || target;

  const handleClick = (e) => {
    e.preventDefault();
    if (targetNote) {
      navigate(`/vault/${target}`);
    }
  };

  const handleMouseEnter = () => {
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
  };

  return (
    <span className="relative inline-block">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          text-accent hover:text-accent/80 transition-colors font-medium
          ${targetNote ? 'cursor-pointer' : 'cursor-default opacity-60'}
        `}
        disabled={!targetNote}
      >
        [[{linkText}]]
      </button>
      
      {showPreview && targetNote && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-surface border border-border rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ background: getFolderColor(targetNote.folder) }}
            ></div>
            <h3 className="font-semibold text-foreground text-sm">{targetNote.title}</h3>
          </div>
          <p className="text-xs text-secondary mb-2 capitalize">{targetNote.folder}</p>
          <p className="text-sm text-secondary leading-relaxed">
            {targetNote.excerpt}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-secondary">
            <span>{targetNote.wordCount} words</span>
            <span>{targetNote.links?.length || 0} links</span>
          </div>
        </div>
      )}
    </span>
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