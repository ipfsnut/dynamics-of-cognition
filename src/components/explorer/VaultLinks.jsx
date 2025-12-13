import { useNavigate } from 'react-router-dom';
import { getNotesForDemo } from '../../utils/demoMapping';
import { getFolderColor } from '../../utils/vaultParser';

/**
 * Shows links to related vault notes from Explorer sections
 */
export default function VaultLinks({ sectionSlug }) {
  const navigate = useNavigate();
  const relatedNotes = getNotesForDemo(sectionSlug);
  
  if (!relatedNotes || relatedNotes.length === 0) {
    return null;
  }

  const handleNoteClick = (noteId) => {
    const [folder, name] = noteId.split('/');
    navigate(`/vault/${folder}/${name}`);
  };

  // Helper to get note display info
  const getNoteInfo = (noteId) => {
    const [folder, name] = noteId.split('/');
    let title = name.replace(/-/g, ' ');
    
    // Special cases for better titles
    if (noteId.startsWith('canonical/')) {
      const sectionNum = name.match(/^(\d+)-/)?.[1];
      if (sectionNum) {
        title = title.replace(/^\d+-/, '');
      }
    } else if (noteId.startsWith('concepts/')) {
      if (name === 'h-omega') title = 'H(ω) — Configuration Constraint';
    }
    
    return {
      title: title.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      folder,
      color: getFolderColor(folder)
    };
  };

  return (
    <div className="bg-surface/30 border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="text-sm font-semibold text-foreground">
          Related Theory Notes
        </h3>
      </div>
      
      <p className="text-xs text-secondary mb-3">
        Deep dive into the theoretical foundations behind this demo
      </p>
      
      <div className="space-y-2">
        {relatedNotes.map((noteId) => {
          const noteInfo = getNoteInfo(noteId);
          return (
            <button
              key={noteId}
              onClick={() => handleNoteClick(noteId)}
              className="w-full text-left p-2 rounded hover:bg-surface/50 transition-colors group border border-border/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ background: noteInfo.color }}
                ></div>
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {noteInfo.title}
                </span>
              </div>
              <span className="text-xs text-secondary capitalize ml-4">
                {noteInfo.folder}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}