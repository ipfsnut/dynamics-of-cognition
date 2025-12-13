import { useState, useEffect } from 'react';
import { MarkdownViewer } from '../components/MarkdownViewer';

/**
 * AboutPage - Display meta/README.md content from vault
 * Shows project info, Discord link, and vault setup instructions
 */
export default function AboutPage() {
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
    <div className="min-h-screen bg-void text-text">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Navigation */}
        <div className="mb-8 pb-6 border-b border-border">
          <nav className="flex items-center gap-4 text-sm">
            <a href="/" className="text-muted hover:text-glow transition-colors">
              ← Paper
            </a>
            <span className="text-border">•</span>
            <a href="/graph" className="text-muted hover:text-glow transition-colors">
              Graph
            </a>
            <span className="text-border">•</span>
            <a href="/explore" className="text-muted hover:text-glow transition-colors">
              Explore
            </a>
          </nav>
        </div>

        {/* Content */}
        <article className="prose-custom">
          <MarkdownViewer content={content} />
        </article>
      </div>
    </div>
  );
}