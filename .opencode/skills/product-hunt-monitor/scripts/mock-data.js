// Mock data for Product Hunt monitor (simulation mode)
// This file is used when API_TOKEN is not configured

const mockData = {
  "products": [
    {
      "id": "magicui-2026",
      "name": "MagicUI",
      "tagline": "AI-powered UI component generator for modern web apps",
      "description": "MagicUI is an innovative AI tool that helps developers and designers generate beautiful, responsive UI components in seconds. Simply describe what you need, and MagicUI creates production-ready React/Vue/Svelte components with full TypeScript support. Perfect for rapid prototyping and accelerating development workflows.",
      "url": "https://www.producthunt.com/products/magicui",
      "votes_count": 487,
      "comments_count": 92,
      "topics": ["AI", "Design Tools", "Developer Tools", "React", "UI"],
      "website_url": "https://magicui.dev",
      "thumbnail_url": "https://ph-files.imgix.net/magicui-preview.png?auto=format&fit=crop",
      "created_at": "2026-04-28T12:00:00Z",
      "makers": [
        { "name": "Alex Chen", "username": "alexchen" },
        { "name": "Sarah Kim", "username": "sarahkim" }
      ],
      "reviews": [
        { "rating": 5, "text": "This tool saved me hours of work!" },
        { "rating": 4, "text": "Great for rapid prototyping" }
      ]
    },
    {
      "id": "aicopy-2026",
      "name": "AICopy",
      "tagline": "Smart clipboard manager with AI-powered suggestions",
      "description": "AICopy revolutionizes copy-paste workflow with intelligent clipboard history and AI-powered content suggestions. Automatically categorizes your clips, suggests relevant pastes, and even rewrites content for different contexts.",
      "url": "https://www.producthunt.com/products/aicopy",
      "votes_count": 342,
      "comments_count": 67,
      "topics": ["AI", "Productivity", "Mac", "Windows"],
      "website_url": "https://aicopy.app",
      "thumbnail_url": "https://ph-files.imgix.net/aicopy-preview.png?auto=format&fit=crop",
      "created_at": "2026-04-28T10:30:00Z",
      "makers": [
        { "name": "Mike Johnson", "username": "mikej" }
      ],
      "reviews": []
    }
  ],
  "fetched_at": new Date().toISOString()
};

module.exports = mockData;
