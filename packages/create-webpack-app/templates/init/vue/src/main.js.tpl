import { createApp } from 'vue'
import App from './App.vue'
<% if (useVueRouter) { %>import router from './router'<% } %>
<% if (useVuex) { %>import store from './store'<% } %>
<%  if (cssType == 'CSS only') { %>
import "./styles/global.css";<% } if (cssType == 'SASS') { %>
import "./styles/global.scss";<% } if (cssType == 'LESS') { %>
import "./styles/global.less";<% } if (cssType == 'Stylus') { %>
import "./styles/global.styl";<% } %>


const app = createApp(App)
<% if (useVueRouter) { %>app.use(router)<% } %>
<% if (useVuex) { %>app.use(store)<% } %>
app.mount('#app')

<% if (workboxWebpackPlugin) { %>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
<% } %>
