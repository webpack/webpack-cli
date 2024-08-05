import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import App from '../App.vue'
const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/hello-world',
    name: 'HelloWorld',
    component: HelloWorld
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
