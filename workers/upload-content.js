#!/usr/bin/env node

/**
 * Script to encrypt and upload content to Cloudflare Workers KV
 * 
 * Usage: node upload-content.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadContent() {
  console.log('Loading content files...');
  
  // Load the paper and documents
  const paperPath = path.join(__dirname, '../src/assets/paper.md');
  const hOmegaPath = path.join(__dirname, '../public/h-omega-synthesis.md');
  const configDynamicsPath = path.join(__dirname, '../public/configuration-dynamics.md');
  
  const [paper, hOmega, configDynamics] = await Promise.all([
    fs.readFile(paperPath, 'utf-8'),
    fs.readFile(hOmegaPath, 'utf-8'),
    fs.readFile(configDynamicsPath, 'utf-8'),
  ]);
  
  return {
    paper,
    documents: {
      'h-omega-synthesis': hOmega,
      'configuration-dynamics': configDynamics,
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    }
  };
}

async function uploadToKV(content) {
  console.log('Uploading to Cloudflare KV...');
  
  // You'll need to run this with wrangler
  // wrangler kv:key put --binding=CONTENT_STORE "protected-content" "$(cat content.json)"
  
  const contentJson = JSON.stringify(content, null, 2);
  const outputPath = path.join(__dirname, 'content.json');
  
  await fs.writeFile(outputPath, contentJson);
  
  console.log('Content saved to content.json');
  console.log('');
  console.log('To upload to Cloudflare KV, run:');
  console.log('');
  console.log('cd workers');
  console.log('npx wrangler kv:key put --binding=CONTENT_STORE "protected-content" "$(cat content.json)"');
  console.log('');
  console.log('Make sure you have wrangler installed and configured first:');
  console.log('npm install -g wrangler');
  console.log('wrangler login');
}

// Main execution
async function main() {
  try {
    const content = await loadContent();
    await uploadToKV(content);
    console.log('✓ Content prepared for upload');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();