---
name: rss-fetcher
description: |
  抓取 RSS 订阅源（如 AppSumo、其他工具推荐站），提取结构化数据。

  Triggers when user mentions:
  - "fetch RSS feed"
  - "monitor AppSumo deals"
  - "subscribe to RSS source"
---

## Quick Usage (Already Configured)

### 抓取单个 RSS 源
```bash
node scripts/fetch-rss.js <rss-url>
```

### 批量抓取配置的 RSS 源
```bash
node scripts/batch-fetch.js
```

## 环境变量配置

复制 `.env.example` 为 `.env` 并填写：

```bash
cp .env.example .env
```

所需配置项（见 `.env.example`）：
- `RSS_SOURCES` - RSS 源列表（JSON 格式或逗号分隔的 URL）
- `FETCH_LIMIT` - 每个源抓取的最大条目数（默认 10）

## 输入格式

RSS URL（支持 Atom 和 RSS 2.0）：
- AppSumo: `https://appsumo.com/tools/feed/`
- 其他工具站: 自定义 RSS URL

## 输出格式

标准 JSON 格式（与 product-hunt-monitor 兼容）：

```json
{
  "products": [
    {
      "id": "appsumo-lifetime-deal-123",
      "name": "Tool Name",
      "tagline": "Brief description from RSS",
      "description": "Full description from RSS content...",
      "url": "https://appsumo.com/products/...",
      "source": "AppSumo",
      "topics": ["Productivity", "Marketing"],
      "website_url": "https://tool-website.com",
      "thumbnail_url": "https://...",
      "published_at": "2026-04-28T09:00:00Z"
    }
  ],
  "fetched_at": "2026-04-28T14:30:00Z",
  "source": "AppSumo RSS"
}
```

## Common Gotchas

- 某些 RSS 源可能有反爬虫机制，需要设置 User-Agent
- RSS 内容可能不完整，需要访问原始链接获取详细信息
- AppSumo 的 RSS 可能需要特殊处理（见 `scripts/appsumo-parser.js`）

## First-Time Setup (If Not Configured)

1. 找到你想监控的 RSS 源 URL
2. 将 URL 添加到 `.env` 文件：
   ```
   RSS_SOURCES=https://appsumo.com/tools/feed/,https://another-source.com/feed/
   FETCH_LIMIT=10
   ```

## 模拟模式

如果未配置 RSS_SOURCES，脚本会使用内置的模拟数据（见 `scripts/mock-rss-data.js`），用于测试整个流程。

## Notes

- 此技能只负责**抓取和结构化 RSS 数据**
- 输出传递给 `content-rewriter` 技能进行改写
- 支持多个 RSS 源批量抓取
