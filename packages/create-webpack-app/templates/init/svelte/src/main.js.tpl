import { mount } from 'svelte';
import App from './App.svelte';

import "./styles/global.<%= styleExtension %>";


const app = mount(App, {
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
