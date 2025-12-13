#!/usr/bin/env node

/**
 * Build Script: Vault Manifest Generator
 * Scans Obsidian vault and generates JSON manifest for graph visualization
 * Run with: node scripts/buildVaultManifest.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - use environment variable from fetch-vault script if available
const VAULT_PATH = process.env.VAULT_SOURCE_FOR_MANIFEST || 
                   path.resolve(__dirname, '../../cognition-dynamics-vault');
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/vault-manifest.json');
const EXCLUDE_FOLDERS = ['scratch', '.obsidian', '.git', '.trash'];

/**
 * Extract wiki-links from markdown content
 */
function extractWikiLinks(content) {
  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  const links = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    // Store just the target, normalized
    links.push(match[1].trim().toLowerCase().replace(/\.md$/, ''));
  }
  
  return [...new Set(links)]; // Remove duplicates
}

/**
 * Get excerpt from content, removing markup
 */
function getExcerpt(content, maxLength = 200) {
  const cleaned = content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/^#+\s+.*/gm, '') // Remove headers
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, display) => display || target) // Wiki-links
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Code
    .replace(/\$\$[\s\S]*?\$\$/g, '[Math]') // LaTeX blocks
    .replace(/\$([^$]+)\$/g, '[Math]') // Inline LaTeX
    .replace(/\n+/g, ' ') // Normalize whitespace
    .trim();
  
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) + '...' : cleaned;
}

/**
 * Extract title from content or use filename
 */
function extractTitle(content, filename) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch?.[1] || filename.replace('.md', '').replace(/-/g, ' ');
}

/**
 * Recursively scan vault directory
 */
function scanVault(vaultPath) {
  const notes = {};
  
  function processDirectory(dirPath, folderName = '') {
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory does not exist: ${dirPath}`);
      return;
    }
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded folders
        if (!EXCLUDE_FOLDERS.includes(item)) {
          processDirectory(fullPath, item);
        }
      } else if (item.endsWith('.md')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const { data: frontmatter, content: body } = matter(content);
          
          // Generate note ID
          const noteId = folderName 
            ? `${folderName}/${item.replace('.md', '')}`
            : item.replace('.md', '');
          
          // Extract metadata
          const title = frontmatter.title || extractTitle(body, item);
          const excerpt = getExcerpt(body);
          const links = extractWikiLinks(body);
          
          notes[noteId] = {
            id: noteId,
            title,
            folder: folderName || 'root',
            path: path.relative(process.cwd(), fullPath),
            excerpt,
            content: body, // Include full content for password-protected access
            links,
            backlinks: [], // Will be computed in second pass
            wordCount: body.split(/\s+/).length,
            lastModified: stat.mtime.toISOString()
          };
          
        } catch (error) {
          console.warn(`Error processing ${fullPath}:`, error.message);
        }
      }
    }
  }
  
  processDirectory(vaultPath);
  return notes;
}

/**
 * Resolve wiki-link targets and compute backlinks
 */
function computeBacklinks(notes) {
  const noteIds = Object.keys(notes);
  
  for (const [sourceId, note] of Object.entries(notes)) {
    for (const linkTarget of note.links) {
      // Try to resolve the target
      const resolved = noteIds.find(id => 
        id === linkTarget || 
        id.endsWith(`/${linkTarget}`) ||
        id.split('/').pop() === linkTarget
      );
      
      if (resolved) {
        // Add backlink
        if (!notes[resolved].backlinks.includes(sourceId)) {
          notes[resolved].backlinks.push(sourceId);
        }
      } else {
        // Track orphan links for debugging
        console.warn(`Orphan link: "${linkTarget}" in ${sourceId}`);
      }
    }
  }
}

/**
 * Build graph data structure
 */
function buildGraphData(notes) {
  const nodes = [];
  const edges = [];
  const nodeIds = new Set(Object.keys(notes));
  
  for (const [id, note] of Object.entries(notes)) {
    nodes.push({
      id,
      title: note.title,
      folder: note.folder,
      linkCount: note.links.length + note.backlinks.length,
      wordCount: note.wordCount
    });
    
    // Add edges for resolved links
    for (const linkTarget of note.links) {
      const resolved = Object.keys(notes).find(nid => 
        nid === linkTarget || 
        nid.endsWith(`/${linkTarget}`) ||
        nid.split('/').pop() === linkTarget
      );
      
      if (resolved && nodeIds.has(resolved)) {
        edges.push({ 
          source: id, 
          target: resolved,
          weight: 1 // Could be enhanced with link frequency
        });
      }
    }
  }
  
  return { nodes, edges };
}

/**
 * Generate folder statistics
 */
function generateStats(notes) {
  const folders = {};
  let totalWords = 0;
  let totalLinks = 0;
  
  for (const note of Object.values(notes)) {
    const folder = note.folder;
    if (!folders[folder]) {
      folders[folder] = { count: 0, words: 0, links: 0 };
    }
    
    folders[folder].count++;
    folders[folder].words += note.wordCount;
    folders[folder].links += note.links.length;
    
    totalWords += note.wordCount;
    totalLinks += note.links.length;
  }
  
  return {
    totalNotes: Object.keys(notes).length,
    totalWords,
    totalLinks,
    folders,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('🗂️  Scanning Obsidian vault...');
  console.log(`📁 Vault path: ${VAULT_PATH}`);
  
  if (!fs.existsSync(VAULT_PATH)) {
    console.error(`❌ Vault not found at: ${VAULT_PATH}`);
    process.exit(1);
  }
  
  // Scan vault
  const notes = scanVault(VAULT_PATH);
  console.log(`📝 Found ${Object.keys(notes).length} notes`);
  
  // Compute backlinks
  console.log('🔗 Computing backlinks...');
  computeBacklinks(notes);
  
  // Build graph
  console.log('📊 Building graph data...');
  const graph = buildGraphData(notes);
  console.log(`📈 Graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
  
  // Generate stats
  const stats = generateStats(notes);
  
  // Create manifest
  const manifest = {
    notes,
    graph,
    stats,
    meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      vaultPath: VAULT_PATH
    }
  };
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write manifest
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest written to: ${OUTPUT_PATH}`);
  
  // Print summary
  console.log('\n📋 Summary:');
  console.log(`   Notes: ${stats.totalNotes}`);
  console.log(`   Words: ${stats.totalWords.toLocaleString()}`);
  console.log(`   Links: ${stats.totalLinks}`);
  console.log(`   Folders: ${Object.keys(stats.folders).join(', ')}`);
  
  return manifest;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as buildVaultManifest };