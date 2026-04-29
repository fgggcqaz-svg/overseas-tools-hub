<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">工具推荐站</h1>
              <p class="text-sm text-gray-500">发现海外优质工具</p>
            </div>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article v-if="tool" class="bg-white rounded-xl shadow-sm p-8">
        <div class="mb-8">
          <div class="flex items-center space-x-4 mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-2xl">{{ tool.name.charAt(0) }}</span>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ tool.name }}</h1>
              <p class="text-lg text-gray-600 mt-1">{{ tool.tagline }}</p>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-6">
            <span 
              v-for="tag in tool.tags" 
              :key="tag"
              class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
            >
              {{ tag }}
            </span>
          </div>
          
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>📅 {{ formatDate(tool.published_at) }}</span>
            <span>📍 来源：{{ tool.source }}</span>
          </div>
        </div>
        
        <!-- Tool Content (loaded from markdown) -->
        <div class="prose max-w-none" v-html="renderedContent">
        </div>
        
        <!-- Visit Website Button -->
        <div class="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
          <router-link to="/" class="text-blue-600 hover:text-blue-700 font-medium">
            ← 返回工具列表
          </router-link>
          <a 
            :href="tool.website_url" 
            target="_blank" 
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            🚀 访问官网
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>

        <!-- 支持作者 -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-bold text-gray-900 mb-2">支持作者</h3>
          <p class="text-sm text-gray-600 mb-4">
            如果您觉得这个AI工具推荐对您有帮助，欢迎支持作者，支持本站持续运营！
          </p>
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <div class="mx-auto mb-4 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center" style="width: 200px; height: 200px;">
              <span class="text-gray-400 text-sm">[请在此处上传您的 AlipayHK 二维码截图]</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">支持 AlipayHK / 转数快 FPS</p>
            <p class="text-sm text-gray-700 font-medium">FPS ID: [在此输入你的 FPS ID]</p>
          </div>
        </div>
      </article>

      <!-- Loading -->
      <div v-else class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text-gray-500 text-sm">
          © 2026 海外实用工具推荐站 · 由 OpenWork 自动生成
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'ToolDetail',
  setup() {
    const route = useRoute()
    const tool = ref(null)
    const renderedContent = ref('')

    const loadTool = async () => {
      try {
        // Load tools.json
        const toolsResponse = await fetch('/data/tools.json')
        const toolsData = await toolsResponse.json()
        const slug = route.params.slug
        
        // Find the tool
        tool.value = toolsData.tools.find(t => t.slug === slug)
        
        if (tool.value) {
          // Load markdown content
          const mdResponse = await fetch(`/content/tools/${slug}.md`)
          const mdContent = await mdResponse.text()
          
          // Convert markdown to HTML (simple conversion)
          renderedContent.value = convertMarkdownToHTML(mdContent)
        }
      } catch (error) {
        console.error('Error loading tool:', error)
      }
    }

    const convertMarkdownToHTML = (md) => {
      return md
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- (.+)/g, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '<br/><br/>')
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric' 
      })
    }

    onMounted(() => {
      loadTool()
    })

    return {
      tool,
      renderedContent,
      formatDate
    }
  }
}
</script>
