import App from './App.svelte';

<%  if (cssType == 'CSS only') { %>
import "./styles/global.css";<% } if (cssType == 'SASS') { %>
import "./styles/global.scss";<% } if (cssType == 'LESS') { %>
import "./styles/global.less";<% } if (cssType == 'Stylus') { %>
import "./styles/global.styl";<% } %>


const app = new App({
  target: document.getElementById('app'),
});

export default app;

<% if (workboxWebpackPlugin) { %>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
<% } %>
