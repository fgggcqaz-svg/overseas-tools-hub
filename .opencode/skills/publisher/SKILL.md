---
name: publisher
description: |
  将改写后的内容发布到静态网站（Vercel + GitHub），生成 Markdown 文件和 JSON 数据索引。

  Triggers when user mentions:
  - "publish to static site"
  - "deploy to Vercel"
  - "generate site content"
  - "push to GitHub Pages"
---

## Quick Usage (Already Configured)

### 发布单个改写后的内容
```bash
node scripts/publish.js <rewritten-markdown-file>
```

### 批量发布（处理 output 目录）
```bash
node scripts/batch-publish.js
```

### 生成站点索引（JSON）
```bash
node scripts/generate-index.js
```

## 环境变量配置

复制 `.env.example` 为 `.env` 并填写：

```bash
cp .env.example .env
```

所需配置项（见 `.env.example`）：
- `GITHUB_TOKEN` - GitHub Personal Access Token（用于提交内容）
- `GITHUB_REPO` - 仓库名（格式：`username/repo`）
- `GITHUB_BRANCH` - 分支名（默认：main）
- `CONTENT_DIR` - 内容存放目录（默认：content/tools）
- `SITE_URL` - 你的站点 URL（用于生成链接）

## 发布流程

1. **接收输入**：来自 `content-rewriter` 的 Markdown 文件
2. **生成元数据**：提取标题、标签、日期等
3. **保存到本地**：`content/tools/magicui.md`
4. **更新索引**：`data/tools.json`（用于站点动态加载）
5. **提交到 GitHub**：自动 git commit & push（如果配置了 GITHUB_TOKEN）
6. **触发 Vercel 部署**：GitHub push 会自动触发 Vercel 部署

## 输出结构

```
your-repo/
├── content/
│   └── tools/
│       ├── magicui.md
│       ├── aicopy.md
│       └── ...
├── data/
│   └── tools.json          # 工具索引（用于站点）
└── site/                   # 静态站点代码（Next.js/Vite等）
    └── ...
```

### tools.json 格式

```json
{
  "tools": [
    {
      "id": "magicui",
      "name": "MagicUI",
      "tagline": "AI 驱动的 UI 组件生成器",
      "slug": "magicui",
      "tags": ["AI", "设计工具", "开发者工具"],
      "published_at": "2026-04-28T14:30:00Z",
      "source": "Product Hunt",
      "votes": 487,
      "file": "content/tools/magicui.md"
    }
  ],
  "last_updated": "2026-04-28T14:30:00Z"
}
```

## Common Gotchas

- 确保 GitHub Token 有 `repo` 权限
- 首次使用需要初始化 Git 仓库（如果还没初始化）
- Vercel 需要连接 GitHub 仓库才能自动部署
- Markdown 文件中的中文需要确保 UTF-8 编码

## First-Time Setup (If Not Configured)

### 1. 创建 GitHub 仓库
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create your-site-name --public
git push -u origin main
```

### 2. 获取 GitHub Token
访问：https://github.com/settings/tokens/new
- 勾选 `repo` 权限
- 生成 token 并复制到 `.env`

### 3. 连接 Vercel
- 访问 https://vercel.com/new
- 导入你的 GitHub 仓库
- Vercel 会自动检测并部署

## 模拟模式

如果未配置 GITHUB_TOKEN，脚本会：
- 在本地生成 Markdown 和 JSON 文件
- 显示模拟的 git commit 信息
- 输出 Vercel 部署指令（但不会真正部署）

## Notes

- 此技能是流程的最后一步，负责**发布内容**
- 输入来自 `content-rewriter` 的 Markdown 文件
- 会自动处理重复内容（基于工具名称判断）
- 支持增量更新（只发布新内容）
