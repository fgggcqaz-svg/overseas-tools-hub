#!/usr/bin/env node

/**
 * Product Hunt Monitor - Fetch Top Products
 * 
 * This script fetches top products from Product Hunt.
 * If API_TOKEN is not configured, it returns mock data for testing.
 */

require('dotenv').config();
const mockData = require('./mock-data.js');

const PRODUCT_HUNT_API_TOKEN = process.env.PRODUCT_HUNT_API_TOKEN;
const FETCH_LIMIT = parseInt(process.env.FETCH_LIMIT || '10');

async function fetchFromAPI() {
  // Product Hunt API GraphQL endpoint
  const query = `
    query {
      posts(order: VOTES, first: ${FETCH_LIMIT}) {
        edges {
          node {
            id
            name
            tagline
            description
            url
            votesCount
            commentsCount
            createdAt
            topics {
              edges {
                node {
                  name
                }
              }
            }
            websiteUrl
            thumbnail {
              url
            }
            makers {
              edges {
                node {
                  name
                  username
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRODUCT_HUNT_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    products: data.data.posts.edges.map(edge => {
      const post = edge.node;
      return {
        id: post.id,
        name: post.name,
        tagline: post.tagline,
        description: post.description,
        url: post.url,
        votes_count: post.votesCount,
        comments_count: post.commentsCount,
        topics: post.topics.edges.map(t => t.node.name),
        website_url: post.websiteUrl,
        thumbnail_url: post.thumbnail?.url,
        created_at: post.createdAt,
        makers: post.makers.edges.map(m => m.node)
      };
    }),
    fetched_at: new Date().toISOString()
  };
}

async function main() {
  try {
    let data;
    
    if (!PRODUCT_HUNT_API_TOKEN || PRODUCT_HUNT_API_TOKEN === 'your_product_hunt_api_token_here') {
      console.log('⚠️  No API token found. Using mock data for simulation...\n');
      data = mockData;
    } else {
      console.log('✅ API token found. Fetching from Product Hunt...\n');
      data = await fetchFromAPI();
    }

    // Output structured JSON
    console.log(JSON.stringify(data, null, 2));
    
    // Also save to file for downstream processing
    const fs = require('fs');
    const outputPath = './scripts/output.json';
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`\n📦 Data saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
