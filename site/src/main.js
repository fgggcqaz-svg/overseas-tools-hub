import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ToolDetail from './views/ToolDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: App
    },
    {
      path: '/tools/:slug',
      name: 'ToolDetail',
      component: ToolDetail,
      props: true
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
