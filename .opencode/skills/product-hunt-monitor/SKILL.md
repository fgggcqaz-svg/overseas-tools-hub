---
name: product-hunt-monitor
description: |
  监控 Product Hunt 并提取热门产品信息，生成结构化数据供后续处理。

  Triggers when user mentions:
  - "monitor Product Hunt"
  - "fetch from Product Hunt"
  - "get top products today"
---

## Quick Usage (Already Configured)

### 获取今日热门产品
```bash
node scripts/fetch-top-products.js
```

### 获取特定产品详情
```bash
node scripts/fetch-product-details.js [product-id]
```

## 环境变量配置

复制 `.env.example` 为 `.env` 并填写：

```bash
cp .env.example .env
```

所需配置项（见 `.env.example`）：
- `PRODUCT_HUNT_API_TOKEN` - Product Hunt API 令牌
- `FETCH_LIMIT` - 每次获取的产品数量（默认 10）

## 数据结构

脚本输出标准 JSON 格式：

```json
{
  "products": [
    {
      "id": "12345",
      "name": "MagicUI",
      "tagline": "AI-powered UI component generator",
      "description": "Generate beautiful UI components with AI...",
      "url": "https://www.producthunt.com/products/magicui",
      "votes_count": 450,
      "comments_count": 89,
      "topics": ["AI", "Design Tools", "Developer Tools"],
      "website_url": "https://magicui.dev",
      "thumbnail_url": "https://ph-files.imgix.net/...",
      "created_at": "2026-04-28T12:00:00Z"
    }
  ],
  "fetched_at": "2026-04-28T14:30:00Z"
}
```

## Common Gotchas

- Product Hunt API 需要 OAuth token，申请地址：https://www.producthunt.com/settings/developer
- API 有速率限制（每小时 100 次请求）
- 某些产品可能没有 `website_url` 或 `thumbnail_url`

## First-Time Setup (If Not Configured)

1. 访问 https://www.producthunt.com/settings/developer
2. 创建新应用，获取 API Token
3. 将 Token 添加到 `.env` 文件：
   ```
   PRODUCT_HUNT_API_TOKEN=your_token_here
   ```

## 模拟数据模式

如果未配置 API Token，脚本会自动返回模拟数据（见 `scripts/mock-data.json`），用于测试整个流程。

## Notes

- 此技能只负责**抓取和结构化数据**，不负责内容改写或发布
- 输出数据会传递给 `content-rewriter` 技能进行下一步处理
