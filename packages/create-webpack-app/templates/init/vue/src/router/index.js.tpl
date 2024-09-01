import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue';
import Layout from '../components/Layout.vue';
import About from '../components/About.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'about',
        name: 'About',
        component: About,
        props: { msg: 'Vue' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
