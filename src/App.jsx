import { useState, useEffect } from 'react';
import { Explorer } from './Explorer';
import { PaperPage } from './PaperPage';
import { DocPage } from './DocPage';
import { ConfidentialBanner } from './components/ConfidentialBanner';
import { SECTIONS, getSectionBySlug, getSectionById } from './data/sections';

// Import theory documents
import hOmegaContent from '../public/h-omega-synthesis.md?raw';
import configDynamicsContent from '../public/configuration-dynamics.md?raw';

/**
 * App - Main application with hash-based routing
 * 
 * Routes:
 *   #/paper - Full academic paper view
 *   #/doc/h-omega-synthesis - H(ω) formal synthesis
 *   #/doc/configuration-dynamics - Configuration dynamics working doc
 *   #/explore/:sectionSlug - Individual section pages
 *   (default) - Section navigation
 */
export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  
  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Navigate to a route
  const navigate = (path) => {
    window.location.hash = path;
  };
  
  // Determine which content to render
  let content;
  
  // Route: Paper view
  if (route.view === 'paper') {
    content = (
      <PaperPage 
        onBack={() => navigate('/explore/introduction')} 
      />
    );
  }
  // Route: H(ω) Synthesis doc
  else if (route.view === 'doc' && route.docSlug === 'h-omega-synthesis') {
    content = (
      <DocPage
        content={hOmegaContent}
        title="H(ω): The Configuration Constraint"
        version="Working Draft"
        onBack={() => navigate('/explore/configuration')}
        backLabel="Back to Configuration"
      />
    );
  }
  // Route: Configuration Dynamics doc
  else if (route.view === 'doc' && route.docSlug === 'configuration-dynamics') {
    content = (
      <DocPage
        content={configDynamicsContent}
        title="Configuration Dynamics"
        version="Working Draft"
        onBack={() => navigate('/explore/configuration')}
        backLabel="Back to Configuration"
      />
    );
  }
  // Route: Explorer (section pages)
  else {
    const currentSection = route.sectionSlug 
      ? getSectionBySlug(route.sectionSlug) 
      : SECTIONS[0];
      
    content = (
      <Explorer 
        currentSection={currentSection || SECTIONS[0]}
        onNavigate={(section) => navigate(`/explore/${section.slug}`)}
        onReadPaper={() => navigate('/paper')}
      />
    );
  }
  
  return (
    <>
      <ConfidentialBanner />
      <div className="app-with-banner">
        {content}
      </div>
    </>
  );
}

/**
 * Parse hash route
 */
function parseHash(hash) {
  const path = hash.replace(/^#\/?/, '');
  
  if (path === 'paper') {
    return { view: 'paper' };
  }
  
  if (path.startsWith('doc/')) {
    const docSlug = path.replace('doc/', '');
    return { view: 'doc', docSlug };
  }
  
  if (path.startsWith('explore/')) {
    const sectionSlug = path.replace('explore/', '');
    return { view: 'explore', sectionSlug };
  }
  
  // Default to first section
  return { view: 'explore', sectionSlug: 'introduction' };
}
