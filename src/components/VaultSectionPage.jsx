import { useMemo } from 'react';
import { Section, SectionHeader, PageNavigation } from './Section';
import { SectionMarkdownViewer } from './SectionMarkdownViewer';
import { Bibliography } from './Bibliography';

/**
 * VaultSectionPage - Generic page that renders vault content with simulations
 * 
 * Takes raw markdown content from the vault's canonical files and renders it
 * with embedded simulations wherever ::sim[id] markers appear.
 */
export function VaultSectionPage({ 
  section, 
  content, 
  prevSection, 
  nextSection, 
  onNavigate 
}) {
  // Strip the title line and subtitle blockquote from content
  // (we render those via SectionHeader)
  const processedContent = useMemo(() => {
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
    
    // Skip subtitle blockquote (> subtitle)
    if (lines[startIndex]?.startsWith('> ')) {
      startIndex++;
    }
    
    // Skip empty lines after subtitle
    while (startIndex < lines.length && lines[startIndex].trim() === '') {
      startIndex++;
    }
    
    // Find and remove the footer (everything after --- followed by **See also** or **Previous**)
    let endIndex = lines.length;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].startsWith('**See also') || lines[i].startsWith('**Previous')) {
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
  }, [content]);

  // Extract subtitle from content if section doesn't have one
  const subtitle = useMemo(() => {
    if (section.subtitle) return section.subtitle;
    if (!content) return null;
    
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('> ')) {
        return line.slice(2).trim();
      }
    }
    return null;
  }, [content, section.subtitle]);

  if (!content) {
    return (
      <Section>
        <SectionHeader 
          number={section.number}
          title={section.title}
          subtitle={subtitle}
        />
        <div className="text-text/50 italic">
          Loading content...
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader 
        number={section.number}
        title={section.title}
        subtitle={subtitle}
        isIntro={section.isIntro}
        isSynthesis={section.isSynthesis}
      />

      <SectionMarkdownViewer content={processedContent} />

      <Bibliography referenceIds={section.references} />
      
      <PageNavigation 
        prevSection={prevSection}
        nextSection={nextSection}
        onNavigate={onNavigate}
      />
    </Section>
  );
}
