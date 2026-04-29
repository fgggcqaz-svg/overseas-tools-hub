<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">工具推荐站</h1>
              <p class="text-sm text-gray-500">发现海外优质工具</p>
            </div>
          </div>
          
          <!-- Search -->
          <div class="flex-1 max-w-md mx-8">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索工具..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <a 
            href="https://github.com" 
            target="_blank"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <section class="text-center mb-12 animate-fade-in">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          发现海外最新
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            AI 工具
          </span>
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          精选 Product Hunt、AppSumo 等平台的优质工具，为你提供中文介绍和使用建议
        </p>
      </section>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button 
          @click="selectedTag = ''"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedTag === '' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          全部
        </button>
        <button 
          v-for="tag in allTags" 
          :key="tag"
          @click="selectedTag = tag"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedTag === tag 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Tools Grid -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <div v-else-if="filteredTools.length === 0" class="text-center py-12">
        <p class="text-gray-500">暂无相关工具</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="tool in filteredTools" 
          :key="tool.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer animate-fade-in"
          @click="openTool(tool)"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">{{ tool.name.charAt(0) }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ formatDate(tool.published_at) }}</span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ tool.name }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ tool.tagline }}</p>
            
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in tool.tags?.slice(0, 3)" 
                :key="tag"
                class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span class="text-sm text-gray-500">{{ tool.source || 'Product Hunt' }}</span>
              <span class="text-blue-600 text-sm font-medium hover:text-blue-700">
                查看详情 →
              </span>
            </div>
          </div>
        </article>
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
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const tools = ref([])
    const loading = ref(true)
    const searchQuery = ref('')
    const selectedTag = ref('')
    
    const allTags = computed(() => {
      const tags = new Set()
      tools.value.forEach(tool => {
        tool.tags?.forEach(tag => tags.add(tag))
      })
      return Array.from(tags).sort()
    })
    
    const filteredTools = computed(() => {
      let result = tools.value
      
      if (selectedTag.value) {
        result = result.filter(tool => 
          tool.tags?.includes(selectedTag.value)
        )
      }
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(tool =>
          tool.name.toLowerCase().includes(query) ||
          tool.tagline?.toLowerCase().includes(query) ||
          tool.tags?.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      return result
    })
    
    const fetchTools = async () => {
      try {
        const response = await fetch('/data/tools.json')
        const data = await response.json()
        tools.value = data.tools || []
      } catch (error) {
        console.error('Failed to fetch tools:', error)
        // Use mock data for demo
        tools.value = [
          {
            id: 'magicui',
            name: 'MagicUI',
            tagline: 'AI 驱动的 UI 组件生成器',
            slug: 'magicui',
            tags: ['AI', '设计工具', '开发者工具'],
            published_at: new Date().toISOString(),
            source: 'Product Hunt'
          }
        ]
      } finally {
        loading.value = false
      }
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    const openTool = (tool) => {
      window.location.href = `/tools/${tool.slug}`
    }
    
    onMounted(() => {
      fetchTools()
    })
    
    return {
      tools,
      loading,
      searchQuery,
      selectedTag,
      allTags,
      filteredTools,
      formatDate,
      openTool
    }
  }
}
</script>
