import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarkdownViewer } from '../components/MarkdownViewer';

/**
 * AboutPage - Display meta/README.md content from vault
 * Shows project info, Discord link, and vault setup instructions
 */
export default function AboutPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAboutContent() {
      try {
        // Try to load from vault manifest first
        const manifest = await import('../data/vault-manifest.json');
        const aboutNote = manifest.notes['README'] || manifest.notes['meta/README'];
        
        if (aboutNote?.content) {
          setContent(aboutNote.content);
        } else {
          throw new Error('About content not found in vault manifest');
        }
      } catch (err) {
        console.error('Failed to load about content:', err);
        setError('Failed to load about information');
      } finally {
        setLoading(false);
      }
    }

    loadAboutContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-void text-text">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-void text-text">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Header - consistent with PaperPage */}
      <header className="sticky top-0 z-50 bg-void/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text font-display">About This Project</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-lg transition-colors text-xs sm:text-sm"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Paper</span>
            </button>
            
            <button
              onClick={() => navigate('/graph')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-border/10 hover:bg-border/20 text-muted hover:text-text border border-border/30 rounded-lg transition-colors text-xs sm:text-sm"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              <span className="hidden sm:inline">Graph</span>
            </button>
            
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-glow/10 hover:bg-glow/20 text-glow border border-glow/30 rounded-lg transition-colors text-xs sm:text-sm"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden sm:inline">Explore</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article className="prose-custom">
          <MarkdownViewer content={content} />
        </article>
      </main>
    </div>
  );
}