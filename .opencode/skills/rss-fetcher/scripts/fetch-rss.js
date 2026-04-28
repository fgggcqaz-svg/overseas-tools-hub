#!/usr/bin/env node

/**
 * RSS Fetcher - Fetch and parse RSS feeds
 * 
 * This script fetches RSS/Atom feeds and outputs structured JSON.
 * If no RSS_SOURCES configured, it uses mock data for testing.
 */

require('dotenv').config();
const Parser = require('rss-parser');
const mockData = require('./mock-rss-data.js');

const RSS_SOURCES = process.env.RSS_SOURCES;
const FETCH_LIMIT = parseInt(process.env.FETCH_LIMIT || '10');

const parser = new Parser({
  headers: {
    'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (compatible; OpenWork/1.0)'
  }
});

async function fetchRSS(url) {
  try {
    const feed = await parser.parseURL(url);
    
    return {
      source: feed.title || url,
      products: feed.items.slice(0, FETCH_LIMIT).map((item, index) => ({
        id: `${feed.title || 'rss'}-${index}-${Date.now()}`,
        name: item.title || 'Unknown Tool',
        tagline: item.contentSnippet?.substring(0, 100) || '',
        description: item.content || item.description || '',
        url: item.link || '',
        source: feed.title || 'RSS',
        topics: extractTopics(item.categories || []),
        website_url: extractWebsiteUrl(item.link),
        thumbnail_url: extractImage(item),
        published_at: item.pubDate || item.isoDate || new Date().toISOString(),
      }))
    };
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error.message);
    return null;
  }
}

function extractTopics(categories) {
  if (!categories) return [];
  return categories.map(c => typeof c === 'string' ? c : c._ || '').filter(Boolean);
}

function extractWebsiteUrl(url) {
  // Try to extract the actual website URL from AppSumo or other redirect URLs
  if (!url) return '';
  // Simple extraction - can be enhanced based on source
  return url;
}

function extractImage(item) {
  // Try to extract image from RSS item
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:content']?.url) return item['media:content'].url;
  
  // Try to extract from content
  const match = item.content?.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

async function main() {
  try {
    let allData;
    
    if (!RSS_SOURCES) {
      console.log('⚠️  No RSS_SOURCES configured. Using mock data for simulation...\n');
      allData = mockData;
    } else {
      console.log('✅ RSS_SOURCES found. Fetching feeds...\n');
      
      const urls = RSS_SOURCES.split(',').map(u => u.trim()).filter(Boolean);
      const results = await Promise.all(urls.map(fetchRSS));
      
      const validResults = results.filter(r => r !== null);
      
      allData = {
        products: validResults.flatMap(r => r.products),
        fetched_at: new Date().toISOString(),
        sources: validResults.map(r => r.source)
      };
    }

    // Output structured JSON
    console.log(JSON.stringify(allData, null, 2));
    
    // Save to file
    const fs = require('fs');
    const outputPath = './scripts/output.json';
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    console.log(`\n📦 Data saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
