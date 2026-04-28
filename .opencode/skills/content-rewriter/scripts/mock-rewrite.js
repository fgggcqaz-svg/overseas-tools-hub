#!/usr/bin/env node

/**
 * Mock rewrite function for simulation mode
 */

module.exports = function mockRewrite(product) {
  return `# ${product.name} - ${getChineseTagline(product.tagline)}

## 🎯 解决什么痛点？
在现代 Web 开发中，UI 组件的编写往往耗时且重复。开发者需要花费大量时间在样式调整、响应式设计和组件复用上。${product.name} 通过智能化方案，将原本需要几小时的工作缩短到几分钟，让开发者专注于业务逻辑而非重复劳动。

## 👥 适合谁使用？
- **前端开发者**：需要快速构建高质量 UI 组件，提升开发效率
- **UI/UX 设计师**：希望快速将设计稿转化为可用的代码组件
- **创业团队**：资源有限，需要以最小成本快速验证产品想法

## 💎 核心价值
- **智能生成**：${getCoreValue1(product.topics)}
- **生产级质量**：${getCoreValue2(product.name)}
- **节省时间**：相比传统开发方式，效率提升显著，让团队更专注于核心业务

## 🔗 相关链接
- 官网：[${product.website_url || 'https://example.com'}](${product.website_url || 'https://example.com'})
- Product Hunt：[查看详情](${product.url || '#'})

## 🏷️ 标签
${generateTags(product.topics)}

---
*本文由 OpenWork 自动生成，数据来源：Product Hunt*
`;
};

function getChineseTagline(tagline) {
  const taglines = {
    'AI-powered UI component generator': 'AI 驱动的 UI 组件生成器',
    'Smart clipboard manager with AI-powered suggestions': '智能剪贴板管理器（AI 驱动）',
  };
  return taglines[tagline] || '海外实用工具';
}

function getCoreValue1(topics) {
  if (topics?.includes('AI')) {
    return '利用 AI 技术自动理解需求，生成符合现代标准的代码';
  }
  return '自动化处理重复性工作，提升整体效率';
}

function getCoreValue2(name) {
  if (name.toLowerCase().includes('ui')) {
    return '生成的组件支持 TypeScript，响应式设计，可直接用于生产环境';
  }
  return '输出高质量、可维护的代码或内容';
}

function generateTags(topics) {
  const tagMap = {
    'AI': 'AI',
    'Design Tools': '设计工具',
    'Developer Tools': '开发者工具',
    'React': 'React',
    'Productivity': '效率工具',
  };
  
  if (!topics) return '`工具` `效率`';
  
  return topics.map(t => {
    const tag = tagMap[t] || t;
    return `\`${tag}\``;
  }).join(' ');
}
