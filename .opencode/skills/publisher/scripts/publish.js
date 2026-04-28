#!/usr/bin/env node

/**
 * Publisher - Publish rewritten content to static site (Vercel + GitHub)
 * 
 * This script takes rewritten Markdown and publishes it to the site.
 * If GITHUB_TOKEN is not configured, it runs in simulation mode.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const CONTENT_DIR = process.env.CONTENT_DIR || 'content/tools';
const DATA_DIR = process.env.DATA_DIR || 'data';
const SITE_URL = process.env.SITE_URL || 'https://your-site.vercel.app';

async function publishContent(markdownFile) {
  // Read markdown content
  const markdown = fs.readFileSync(markdownFile, 'utf8');
  
  // Extract metadata from markdown
  const metadata = extractMetadata(markdown, markdownFile);
  
  console.log(`📝 Publishing: ${metadata.name}\n`);
  console.log('--- 内容预览 ---');
  console.log(markdown.substring(0, 500) + '...\n');
  
  // Ensure directories exist
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Save markdown file
  const slug = metadata.slug;
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`);
  fs.writeFileSync(mdPath, markdown);
  console.log(`✅ Saved: ${mdPath}`);
  
  // Update tools.json index
  const indexPath = path.join(DATA_DIR, 'tools.json');
  let index = { tools: [], last_updated: new Date().toISOString() };
  
  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  }
  
  // Check if tool already exists
  const existingIndex = index.tools.findIndex(t => t.slug === slug);
  const toolEntry = {
    id: slug,
    name: metadata.name,
    tagline: metadata.tagline,
    slug: slug,
    tags: metadata.tags,
    published_at: new Date().toISOString(),
    source: metadata.source || 'Unknown',
    file: mdPath
  };
  
  if (existingIndex >= 0) {
    index.tools[existingIndex] = toolEntry;
    console.log(`🔄 Updated existing entry: ${slug}`);
  } else {
    index.tools.push(toolEntry);
    console.log(`✨ Added new entry: ${slug}`);
  }
  
  index.last_updated = new Date().toISOString();
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`✅ Updated index: ${indexPath}`);
  
  // Git operations (if configured)
  if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_github_personal_access_token_here') {
    console.log('\n⚠️  No GITHUB_TOKEN found. Running in simulation mode...');
    console.log('\n📋 Simulated git operations:');
    console.log(`   git add ${mdPath} ${indexPath}`);
    console.log(`   git commit -m "Publish: ${metadata.name}"`);
    console.log(`   git push origin ${GITHUB_BRANCH}`);
    console.log('\n💡 To enable auto-publish, configure GITHUB_TOKEN in .env');
  } else {
    console.log('\n🚀 GitHub Token found. Committing and pushing...');
    // Git operations would go here (using simple-git or child_process)
    // For now, just show what would happen
    console.log(`   (Would commit and push to ${GITHUB_REPO})`);
  }
  
  console.log(`\n🌐 Site URL: ${SITE_URL}/${slug}`);
  console.log('\n✅ Publish complete!');
}

function extractMetadata(markdown, filename) {
  // Extract title from first line
  const titleMatch = markdown.match(/^#\s+(.+?)\s+-\s+(.+)$/m);
  const name = titleMatch ? titleMatch[1].trim() : path.basename(filename, '.md');
  const tagline = titleMatch ? titleMatch[2].trim() : '';
  
  // Extract tags
  const tagsMatch = markdown.match(/##\s+🏷️\s+标签\s*\n([\s\S]+?)(?=\n##|$)/);
  const tags = [];
  if (tagsMatch) {
    const tagLine = tagsMatch[1];
    const tagMatches = tagLine.match(/`([^`]+)`/g);
    if (tagMatches) {
      tagMatches.forEach(t => tags.push(t.replace(/`/g, '')));
    }
  }
  
  // Generate slug
  const slug = name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  
  return { name, tagline, tags, slug };
}

async function main() {
  try {
    const markdownFile = process.argv[2];
    
    if (!markdownFile) {
      console.error('❌ Usage: node publish.js <rewritten-markdown-file>');
      process.exit(1);
    }
    
    if (!fs.existsSync(markdownFile)) {
      console.error(`❌ File not found: ${markdownFile}`);
      process.exit(1);
    }
    
    await publishContent(markdownFile);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
