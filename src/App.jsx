import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Explorer } from './Explorer';
import { PaperPage } from './PaperPage';
import GraphPage from './pages/GraphPage';
import NotePage from './pages/NotePage';
import { ConfidentialBanner } from './components/ConfidentialBanner';
import { SECTIONS, getSectionBySlug } from './data/sections';


/**
 * App - Main application with React Router
 * 
 * Routes:
 *   / - Paper view (default)
 *   /graph - Knowledge graph visualization
 *   /vault/:noteId - Individual vault notes
 *   /explore/:section - Interactive beta sections
 * 
 * Includes knowledge graph visualization and vault navigation
 */
export default function App() {
  return (
    <Router>
      <ConfidentialBanner />
      <div className="app-with-banner">
        <Routes>
          {/* Main paper route */}
          <Route path="/" element={<PaperPage />} />
          
          {/* Knowledge graph route */}
          <Route path="/graph" element={<GraphPage />} />
          
          {/* Individual vault note routes */}
          <Route path="/vault/:folder/:noteId" element={<NotePage />} />
          
          {/* Interactive beta routes */}
          <Route path="/explore" element={<ExplorerRoute />} />
          <Route path="/explore/:sectionSlug" element={<ExplorerRoute />} />
        </Routes>
      </div>
    </Router>
  );
}

/**
 * Explorer route component
 */
function ExplorerRoute() {
  const { sectionSlug } = useParams();
  const navigate = useNavigate();
  
  const currentSection = sectionSlug 
    ? getSectionBySlug(sectionSlug) 
    : SECTIONS[0];
    
  return (
    <Explorer 
      currentSection={currentSection || SECTIONS[0]}
      onNavigate={(section) => navigate(`/explore/${section.slug}`)}
      onReadPaper={() => navigate('/')}
    />
  );
}

