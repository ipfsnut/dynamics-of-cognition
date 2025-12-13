import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { getNextSection, getPrevSection } from './data/sections';

// Import all page components
import { IntroductionPage } from './pages/IntroductionPage';
import { FreeEnergyPage } from './pages/FreeEnergyPage';
import { BioelectricPage } from './pages/BioelectricPage';
import { HomeostaticPage } from './pages/HomeostaticPage';
import { AutopoiesisPage } from './pages/AutopoiesisPage';
import { LanguagePage } from './pages/LanguagePage';
import { ControllospherePage } from './pages/ControllospherePage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { NestedBlanketsPage } from './pages/NestedBlanketsPage';
import { ConsciousnessPage } from './pages/ConsciousnessPage';
import { CritiquePage } from './pages/CritiquePage';
import { SynthesisPage } from './pages/SynthesisPage';

// Map section IDs to page components
const PAGE_COMPONENTS = {
  'intro': IntroductionPage,
  'free-energy': FreeEnergyPage,
  'morphogenesis': BioelectricPage,
  'homeostatic': HomeostaticPage,
  'autopoiesis': AutopoiesisPage,
  'language': LanguagePage,
  'controllosphere': ControllospherePage,
  'configuration': ConfigurationPage,
  'predictions': PredictionsPage,
  'nested': NestedBlanketsPage,
  'consciousness': ConsciousnessPage,
  'critique': CritiquePage,
  'synthesis': SynthesisPage,
};

/**
 * Explorer - Main section-based explorer view
 */
export function Explorer({ currentSection, onNavigate, onReadPaper }) {
  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentSection?.id]);

  const PageComponent = PAGE_COMPONENTS[currentSection?.id];
  const prevSection = getPrevSection(currentSection?.id);
  const nextSection = getNextSection(currentSection?.id);

  return (
    <div className="min-h-screen bg-void">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Navigation sidebar */}
      <Navigation 
        currentSection={currentSection}
        onNavigate={onNavigate}
        onReadPaper={onReadPaper}
      />

      {/* Main content area */}
      <main className="lg:ml-72 pt-14 lg:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          {PageComponent ? (
            <PageComponent 
              section={currentSection}
              prevSection={prevSection}
              nextSection={nextSection}
              onNavigate={onNavigate}
              onReadPaper={onReadPaper}
            />
          ) : (
            <div className="text-center py-20 text-muted">
              <p>Page not found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
