---
name: content-rewriter
description: |
  将英文产品信息增值改写为中文内容，总结痛点、受众和价值，而非简单翻译。

  Triggers when user mentions:
  - "rewrite content for Chinese audience"
  - "add value to product description"
  - "transform English product info to Chinese"
---

## Quick Usage (Already Configured)

### 改写单个产品信息
```bash
node scripts/rewrite-product.js <input-json-file>
```

### 批量改写（处理整个 products 数组）
```bash
node scripts/batch-rewrite.js <input-json-file>
```

## 环境变量配置

复制 `.env.example` 为 `.env` 并填写：

```bash
cp .env.example .env
```

所需配置项（见 `.env.example`）：
- `OPENAI_API_KEY` - OpenAI API 密钥（用于内容改写）
- `MODEL` - 使用的模型（默认：gpt-4-turbo-preview）

## 输入格式

接受来自 `product-hunt-monitor` 或 `rss-fetcher` 的标准 JSON 格式：

```json
{
  "name": "MagicUI",
  "tagline": "AI-powered UI component generator",
  "description": "Generate beautiful UI components with AI...",
  "topics": ["AI", "Design Tools"],
  "website_url": "https://magicui.dev"
}
```

## 输出格式

改写后的中文内容（Markdown 格式）：

```markdown
# MagicUI - AI 驱动的 UI 组件生成器

## 🎯 解决什么痛点？
设计师和开发者在构建现代 Web 应用时，常常需要花费大量时间编写重复的 UI 组件代码。MagicUI 通过 AI 技术，让组件生成变得简单快捷，将开发时间从几小时缩短到几分钟。

## 👥 适合谁使用？
- **前端开发者**：需要快速构建原型或生产环境组件
- **UI/UX 设计师**：希望快速验证设计想法
- **创业团队**：资源有限，需要加速产品迭代

## 💎 核心价值
- **AI 智能生成**：只需描述需求，自动生成 React/Vue/Svelte 组件
- **生产级代码**：支持 TypeScript，代码质量高，可直接用于生产环境
- **响应式设计**：自动适配各种屏幕尺寸
- **节省时间**：相比手动编写，效率提升 10 倍以上

## 🔗 相关链接
- 官网：[magicui.dev](https://magicui.dev)
- Product Hunt：[查看详情](https://www.producthunt.com/products/magicui)

## 🏷️ 标签
`AI` `设计工具` `开发者工具` `React` `UI组件`
```

## Common Gotchas

- 改写不是翻译，要**增加价值**（痛点分析、使用场景、对比优势）
- 保持中文表达自然，避免"翻译腔"
- 如果未配置 OpenAI API Key，会使用模拟改写模式

## First-Time Setup (If Not Configured)

1. 访问 https://platform.openai.com/api-keys
2. 创建 API Key
3. 将 Key 添加到 `.env` 文件：
   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
   ```

## 模拟模式

如果未配置 API Key，脚本会自动返回模拟改写内容（见 `scripts/mock-rewrite.js`），用于测试整个流程。

## Notes

- 此技能只负责**内容改写**，不负责抓取或发布
- 输入来自 `product-hunt-monitor` 或 `rss-fetcher`
- 输出传递给 `publisher` 技能进行发布
