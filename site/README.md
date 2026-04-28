# Overseas Tools Hub

海外实用工具推荐站 - 基于 Vite + Vue 3 + Tailwind CSS

## 本地预览

1. 安装依赖：
```bash
cd site
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 浏览器访问：`http://localhost:3000`

## 构建

```bash
npm run build
```

构建产物在 `dist/` 目录

## 数据文件

- `data/tools.json` - 工具索引（由 publisher 技能自动生成）
- `content/tools/*.md` - 工具详细内容（Markdown 格式）

## 部署到 Vercel

1. 推送代码到 GitHub
2. 访问 [vercel.com/new](https://vercel.com/new)
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测 Vite 项目并部署

## 目录结构

```
site/
├── public/
│   ├── tool-template.html    # 工具详情页模板
│   └── vite.svg
├── src/
│   ├── App.vue               # 主应用组件
│   ├── main.js               # 入口文件
│   └── style.css             # 全局样式
├── index.html                # 入口 HTML
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 注意事项

- `data/` 和 `content/` 目录需要在构建时从上级目录复制
- 或者使用 Vercel 的 Build Command 配置自动复制
