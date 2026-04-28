#!/usr/bin/env node

/**
 * Content Rewriter - Rewrite product info for Chinese audience
 * 
 * This script rewrites English product information into valuable Chinese content.
 * If OPENAI_API_KEY is not configured, it uses mock rewrite for testing.
 */

require('dotenv').config();
const fs = require('fs');
const mockRewrite = require('./mock-rewrite.js');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.MODEL || 'gpt-4-turbo-preview';

async function rewriteWithAI(product) {
  const prompt = `你是一位专业的中文科技内容创作者，擅长将海外工具和产品介绍给中文用户。

请将以下英文产品信息改写成中文内容，要求：
1. 不是简单翻译，要增加价值
2. 分析产品解决的痛点
3. 明确目标受众
4. 突出核心价值
5. 使用 Markdown 格式
6. 语言自然，避免翻译腔

产品信息：
- 名称：${product.name}
- 标语：${product.tagline}
- 描述：${product.description}
- 分类：${product.topics?.join(', ')}
- 官网：${product.website_url}

请按以下结构输出：

# [产品名] - [中文标语]

## 🎯 解决什么痛点？
[分析痛点，2-3句话]

## 👥 适合谁使用？
- **受众1**：[说明]
- **受众2**：[说明]
- **受众3**：[说明]

## 💎 核心价值
- **特点1**：[说明]
- **特点2**：[说明]
- **特点3**：[说明]

## 🔗 相关链接
- 官网：[网址]
- Product Hunt：[链接]

## 🏷️ 标签
[用中文标签，用反引号包裹]
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function main() {
  try {
    const inputFile = process.argv[2];
    
    if (!inputFile) {
      console.error('❌ Usage: node rewrite-product.js <input-json-file>');
      process.exit(1);
    }

    const inputData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const product = inputData.products ? inputData.products[0] : inputData;

    console.log(`📝 Rewriting: ${product.name}\n`);

    let rewrittenContent;

    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('⚠️  No OpenAI API key found. Using mock rewrite for simulation...\n');
      rewrittenContent = mockRewrite(product);
    } else {
      console.log('✅ OpenAI API key found. Rewriting with AI...\n');
      rewrittenContent = await rewriteWithAI(product);
    }

    // Output rewritten content
    console.log('--- 改写后的内容 ---\n');
    console.log(rewrittenContent);
    console.log('\n--- 结束 ---');

    // Save to file
    const outputDir = './output';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = `${outputDir}/${product.name.toLowerCase().replace(/\s+/g, '-')}-rewritten.md`;
    fs.writeFileSync(outputPath, rewrittenContent);
    console.log(`\n📦 Rewritten content saved to: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
