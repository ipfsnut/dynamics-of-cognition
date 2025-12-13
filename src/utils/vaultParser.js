/**
 * Vault Parser Utilities for Obsidian-style wiki-link processing
 * Supports [[link]], [[path/link]], [[path/link|Display Text]] patterns
 */

/**
 * Extract wiki-links from markdown content
 * Handles: [[link]], [[folder/link]], [[folder/link|Display Text]]
 */
export function extractWikiLinks(content) {
  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  const links = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    links.push({
      target: match[1].trim(),
      display: match[2]?.trim() || match[1].trim(),
      raw: match[0]
    });
  }
  
  return links;
}

/**
 * Normalize note ID for consistent lookup
 * "concepts/h-omega" and "h-omega" should resolve to same note
 */
export function normalizeNoteId(id) {
  return id
    .toLowerCase()
    .replace(/\.md$/, '')
    .replace(/\s+/g, '-');
}

/**
 * Resolve a wiki-link target to an actual note ID
 * Handles shorthand references like [[h-omega]] -> concepts/h-omega
 */
export function resolveNoteId(target, notes) {
  const normalized = normalizeNoteId(target);
  const noteIds = Object.keys(notes);
  
  // Direct match
  if (noteIds.includes(normalized)) {
    return normalized;
  }
  
  // Search for partial match (shorthand)
  const match = noteIds.find(id => 
    id === normalized || 
    id.endsWith(`/${normalized}`) ||
    id.split('/').pop() === normalized
  );
  
  return match || null;
}

/**
 * Build graph data structure from vault manifest
 */
export function buildGraphData(notes) {
  const nodes = [];
  const edges = [];
  const nodeIds = new Set(Object.keys(notes));
  
  for (const [id, note] of Object.entries(notes)) {
    nodes.push({
      id,
      title: note.title,
      folder: note.folder,
      linkCount: note.links.length + note.backlinks.length
    });
    
    for (const target of note.links) {
      // Only add edge if target exists (avoid orphans in graph)
      const resolvedTarget = resolveNoteId(target, notes);
      if (resolvedTarget && nodeIds.has(resolvedTarget)) {
        edges.push({ source: id, target: resolvedTarget });
      }
    }
  }
  
  return { nodes, edges };
}

/**
 * Get local graph (1-hop neighborhood) for a specific note
 */
export function getLocalGraph(noteId, graphData) {
  const { nodes, edges } = graphData;
  const connected = new Set([noteId]);
  
  // Find all directly connected nodes
  edges.forEach(e => {
    if (e.source === noteId) connected.add(e.target);
    if (e.target === noteId) connected.add(e.source);
  });
  
  return {
    nodes: nodes.filter(n => connected.has(n.id)),
    edges: edges.filter(e => connected.has(e.source) && connected.has(e.target))
  };
}

/**
 * Folder color mapping (matches Obsidian aesthetic)
 */
export const folderColors = {
  canonical: '#3b82f6',  // blue
  concepts: '#8b5cf6',   // purple
  research: '#10b981',   // green
  evidence: '#f59e0b',   // amber
  meta: '#6b7280',       // gray
  default: '#9ca3af'
};

export function getFolderColor(folder) {
  return folderColors[folder] || folderColors.default;
}

/**
 * Parse markdown content and extract title from first H1
 */
export function extractTitle(content, filename) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch?.[1] || filename.replace('.md', '');
}

/**
 * Generate excerpt from markdown content
 */
export function getExcerpt(content, maxLength = 200) {
  // Remove frontmatter, headers, wiki-links
  const cleaned = content
    .replace(/^---[\s\S]*?---/, '') // frontmatter
    .replace(/^#+\s+.*/gm, '') // headers
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, '$2$1') // wiki-links
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italic
    .replace(/`(.*?)`/g, '$1') // inline code
    .replace(/\n+/g, ' ') // normalize whitespace
    .trim();
  
  return cleaned.slice(0, maxLength);
}

/**
 * Check if a file should be excluded from processing
 */
export function shouldExcludeFile(filePath, excludeFolders = ['scratch', '.obsidian', '.git']) {
  const pathParts = filePath.split('/');
  return excludeFolders.some(folder => pathParts.includes(folder));
}

/**
 * Parse markdown content and replace wiki-links with WikiLink components
 * Used for rendering notes with interactive links
 */
export function parseWikiLinks(content, notes) {
  if (!content || typeof content !== 'string') {
    return content;
  }
  
  const parts = [];
  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    // Add text before the wiki-link
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    
    const target = match[1].trim();
    const display = match[2]?.trim() || target;
    const resolvedTarget = resolveNoteId(target, notes || {});
    
    // Add the wiki-link as a component
    parts.push({
      type: 'wikilink',
      target: resolvedTarget || target,
      display,
      key: match.index
    });
    
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  
  return parts;
}