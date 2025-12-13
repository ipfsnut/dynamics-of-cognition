import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import WikiLink from '../components/vault/WikiLink';
import BacklinksPanel from '../components/vault/BacklinksPanel';
import DemoLink from '../components/vault/DemoLink';
import { parseWikiLinks } from '../utils/vaultParser';

export default function NotePage() {
  const { folder, noteId } = useParams();
  const navigate = useNavigate();
  
  // Reconstruct the full note ID
  const fullNoteId = `${folder}/${noteId}`;
  
  const [vaultData, setVaultData] = useState(null);
  const [note, setNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVaultAndNote = async () => {
      try {
        // Load vault manifest
        const manifestModule = await import('../data/vault-manifest.json');
        const manifest = manifestModule.default;
        setVaultData(manifest);

        // Find the note
        const foundNote = manifest.notes[fullNoteId];
        if (!foundNote) {
          setError(`Note not found: ${fullNoteId}`);
          setLoading(false);
          return;
        }

        setNote(foundNote);

        // Use the full content from the manifest
        // Content is password-protected at the app level
        const content = foundNote.content || `# ${foundNote.title}\n\n${foundNote.excerpt}\n\n*Content not available.*`;
        setNoteContent(content);

        setLoading(false);
      } catch (err) {
        console.error('Failed to load note:', err);
        setError('Failed to load note data');
        setLoading(false);
      }
    };

    if (fullNoteId) {
      loadVaultAndNote();
    }
  }, [fullNoteId]);

  const handleBackClick = () => {
    navigate(-1);
  };


  // Custom components for markdown rendering
  const components = {
    // Replace [[wiki-links]] with WikiLink components
    p: ({ children }) => {
      if (typeof children === 'string') {
        const parts = parseWikiLinks(children, vaultData?.notes);
        return (
          <p>
            {parts.map((part) => {
              if (typeof part === 'string') {
                return part;
              } else if (part.type === 'wikilink') {
                return (
                  <WikiLink
                    key={part.key}
                    target={part.target}
                    display={part.display}
                    notes={vaultData?.notes}
                  />
                );
              }
              return null;
            })}
          </p>
        );
      }
      return <p>{children}</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold mb-2">Note Not Found</h1>
          <p className="text-secondary mb-4">{error}</p>
          <button 
            onClick={handleBackClick}
            className="px-4 py-2 bg-accent text-background rounded hover:bg-accent/80 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ background: getFolderColor(note.folder) }}
                ></div>
                <span className="text-sm text-secondary capitalize">{note.folder}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/graph')}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                View Graph
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Interactive demo link */}
            <DemoLink noteId={fullNoteId} />
            
            <article className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={components}
              >
                {noteContent}
              </ReactMarkdown>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Note metadata */}
            <div className="bg-surface/30 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Note Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Words:</span>
                  <span className="text-foreground">{note.wordCount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Links:</span>
                  <span className="text-foreground">{note.links?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Backlinks:</span>
                  <span className="text-foreground">{note.backlinks?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Backlinks panel */}
            <BacklinksPanel 
              backlinks={note.backlinks || []} 
              notes={vaultData?.notes || {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function
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