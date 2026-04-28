#!/usr/bin/env node

/**
 * Generate HTML pages from Markdown tool files
 * This script converts content/tools/*.md to site/tools/*.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const contentDir = path.join(__dirname, '../../content/tools');
const outputDir = path.join(__dirname, '../tools');
const templatePath = path.join(__dirname, '../public/tool-template.html');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read template
let template = fs.readFileSync(templatePath, 'utf8');

// Parse markdown file
function parseMarkdown(mdContent) {
  const lines = mdContent.split('\n');
  
  // Extract title (first # heading)
  const titleMatch = mdContent.match(/^#\s+(.+?)\s+-\s+(.+)$/m);
  const name = titleMatch ? titleMatch[1].trim() : 'Tool';
  const tagline = titleMatch ? titleMatch[2].trim() : '';
  
  // Extract tags
  const tagsMatch = mdContent.match(/##\s+🏷️\s+标签\s*\n([\s\S]+?)(?=\n##|$)/);
  const tags = [];
  if (tagsMatch) {
    const tagLine = tagsMatch[1];
    const tagMatches = tagLine.match(/`([^`]+)`/g);
    if (tagMatches) {
      tagMatches.forEach(t => tags.push(t.replace(/`/g, '')));
    }
  }
  
  // Extract content (remove title and tags section)
  let content = mdContent;
  // Remove the title line
  content = content.replace(/^#\s+.+$/m, '');
  // Remove the tags section
  content = content.replace(/##\s+🏷️\s+标签\s*\n[\s\S]+?(?=\n##|$)/, '');
  // Remove the footer
  content = content.replace(/\n---\n\*本文由 OpenWork[\s\S]+$/, '');
  
  // Convert markdown to HTML (simple conversion)
  content = content
    .replace(/##\s+(.+)/g, '<h2>$1</h2>')
    .replace(/###\s+(.+)/g, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- (.+)/g, '\n<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br><br>')
    .trim();
  
  return { name, tagline, tags, content };
}

// Generate HTML for a tool
function generateHTML(toolData, websiteUrl) {
  let html = template;
  
  // Replace placeholders
  html = html.replace(/\{\{TOOL_NAME\}\}/g, toolData.name);
  html = html.replace(/\{\{TOOL_TAGLINE\}\}/g, toolData.tagline);
  html = html.replace(/\{\{TOOL_INITIAL\}\}/g, toolData.name.charAt(0));
  html = html.replace(/\{\{TOOL_DATE\}\}/g, new Date().toLocaleDateString('zh-CN'));
  html = html.replace(/\{\{TOOL_SOURCE\}\}/g, 'Product Hunt');
  html = html.replace(/\{\{TOOL_CONTENT\}\}/g, toolData.content);
  html = html.replace(/\{\{TOOL_WEBSITE_URL\}\}/g, websiteUrl || '#');
  
  // Generate tags HTML
  const tagsHtml = toolData.tags.map(tag => 
    `<span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">${tag}</span>`
  ).join('\n            ');
  html = html.replace(/\{\{TOOL_TAGS\}\}/g, tagsHtml);
  
  return html;
}

// Main
async function main() {
  console.log('🔧 Generating HTML pages from Markdown...\n');
  
  // Read tools.json to get website URLs
  const toolsJsonPath = path.join(__dirname, '../../data/tools.json');
  const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
  
  const tools = toolsData.tools || [];
  const toolMap = {};
  tools.forEach(tool => {
    toolMap[tool.slug] = tool;
  });
  
  // Read all markdown files
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  console.log(`📁 Found ${files.length} markdown files\n`);
  
  files.forEach(file => {
    const slug = file.replace('.md', '');
    const mdContent = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const toolData = parseMarkdown(mdContent);
    
    // Get website URL from tools.json
    const toolInfo = toolMap[slug];
    const websiteUrl = toolInfo?.website_url || '#';
    
    const html = generateHTML(toolData, websiteUrl);
    const outputPath = path.join(outputDir, `${slug}.html`);
    
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Generated: tools/${slug}.html`);
  });
  
  console.log('\n🎉 All HTML pages generated successfully!');
}

main().catch(console.error);
