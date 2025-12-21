import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { getNextSection, getPrevSection } from './data/sections';
import { Section, SectionHeader, PageNavigation } from './components/Section';
import { SectionMarkdownViewer } from './components/SectionMarkdownViewer';
import { SectionSimulations } from './components/SectionSimulations';
import { Bibliography } from './components/Bibliography';
import VaultLinks from './components/explorer/VaultLinks';

// Map section IDs to vault note IDs
const SECTION_TO_VAULT_MAP = {
  'intro': 'canonical/00-introduction',
  'free-energy': 'canonical/01-free-energy',
  'morphogenesis': 'canonical/02-bioelectric',
  'homeostatic': 'canonical/03-homeostatic',
  'autopoiesis': 'canonical/04-autopoiesis',
  'language': 'canonical/05-language',
  'controllosphere': 'canonical/06-controllosphere',
  'configuration': 'canonical/07-configuration',
  'predictions': 'canonical/11-predictions',
  'nested': 'canonical/09-nested-blankets',
  'consciousness': 'canonical/10-consciousness',
  'critique': 'canonical/12-critique',
  'synthesis': 'canonical/13-synthesis',
};

/**
 * Process vault content for Explorer display
 */
function processVaultContent(content) {
  if (!content) return '';
  
  const lines = content.split('\n');
  let startIndex = 0;
  
  // Skip title line (# Title)
  if (lines[0]?.startsWith('# ')) {
    startIndex = 1;
  }
  
  // Skip empty lines after title
  while (startIndex < lines.length && lines[startIndex].trim() === '') {
    startIndex++;
  }
  
  // Skip subtitle blockquote (> subtitle) but NOT tutorial links (> 📐)
  if (lines[startIndex]?.startsWith('> ') && !lines[startIndex].includes('📐')) {
    startIndex++;
  }
  
  // Skip empty lines after subtitle
  while (startIndex < lines.length && lines[startIndex].trim() === '') {
    startIndex++;
  }
  
  // Find and remove the footer (everything after --- followed by **See also** or **Previous**)
  let endIndex = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startsWith('**See also') || lines[i].startsWith('**Previous') || lines[i].startsWith('**Next:')) {
      // Find the --- before this
      for (let j = i - 1; j >= 0; j--) {
        if (lines[j].trim() === '---') {
          endIndex = j;
          break;
        }
      }
      break;
    }
  }
  
  return lines.slice(startIndex, endIndex).join('\n').trim();
}

/**
 * Explorer - Main section-based explorer view
 */
export function Explorer({ currentSection, onNavigate, onReadPaper }) {
  const [vaultData, setVaultData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load vault data
  useEffect(() => {
    const loadVaultData = async () => {
      try {
        const manifestModule = await import('./data/vault-manifest.json');
        setVaultData(manifestModule.default);
      } catch (err) {
        console.warn('Failed to load vault manifest:', err);
      }
      setLoading(false);
    };
    loadVaultData();
  }, []);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentSection?.id]);

  const prevSection = getPrevSection(currentSection?.id);
  const nextSection = getNextSection(currentSection?.id);
  
  // Get vault content for current section
  const vaultNoteId = SECTION_TO_VAULT_MAP[currentSection?.id];
  const vaultContent = vaultNoteId ? vaultData?.notes[vaultNoteId]?.content : null;
  

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
          {loading ? (
            <div className="text-center py-20 text-muted">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading content...</p>
            </div>
          ) : vaultContent ? (
            <Section>
              <SectionHeader 
                number={currentSection?.number}
                title={currentSection?.title}
                subtitle={currentSection?.subtitle}
                isIntro={currentSection?.isIntro}
                isSynthesis={currentSection?.isSynthesis}
              />

              <SectionMarkdownViewer 
                content={processVaultContent(vaultContent)} 
                vaultData={vaultData}
              />

              {/* Render interactive simulations for this section */}
              <SectionSimulations section={currentSection} />

              <VaultLinks sectionSlug={currentSection?.slug} />
              
              <Bibliography referenceIds={currentSection?.references} />
              
              <PageNavigation 
                prevSection={prevSection}
                nextSection={nextSection}
                onNavigate={onNavigate}
              />
            </Section>
          ) : (
            <div className="text-center py-20 text-muted">
              <p>Content not found for this section</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
