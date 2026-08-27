import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
<% if (useVueStore) { %>
  import { createPinia } from 'pinia'
  const store = createPinia()
<% } %>
import "./styles/global.<%= styleExtension %>";


const app = createApp(App)
app.use(router)
<% if (useVueStore) { %>app.use(store)<% } %>
app.mount('#root')

<% if (workboxWebpackPlugin) { %>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered: ', registration);
    })
    .catch((registrationError) => {
      console.error('Service Worker registration failed: ', registrationError);
    });
  });
}
<% } %>
