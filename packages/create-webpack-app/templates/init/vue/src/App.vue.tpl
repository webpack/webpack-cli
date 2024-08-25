<template>
  <div id="app">
    <img alt="Webpack logo" src="./assets/webpack.png">
    <HelloWorld msg="Hello World"/>
    <% if (useVueStore) { %>
    <p>Count: {{rawExpression  'mainStore.count' }}</p>
    <button class="btn-primary" @click="mainStore.decrement">Decrement</button>
    <button class="btn-secondary" @click="mainStore.increment">Increment</button>
    <% } %>
  </div>
</template>

<script<% if (langType === 'Typescript') { %> lang="ts"<% } %> setup>
  <% if (useVueStore) { %>
  import { useMainStore } from './store'
  const mainStore = useMainStore();
  <% } %>
  import HelloWorld from './components/HelloWorld.vue'
</script>

<% if (isCSS) { %>
<style scoped>

  #app {
    --color-primary: #1C78C0;
    --color-secondary: #8ED6FB;
    --color-dark: #2C3E50;
  }

  button {
    border: none;
    border-radius: 0.5rem;
    padding: 1rem;
    font-size: 1.25rem;
    cursor: pointer;
    margin: 0 1rem;
  }

  /* Button variants */
  .btn-primary {
    background-color: var(--color-primary);
    color: white;
  }

  .btn-secondary {
    background-color: var(--color-secondary);
    color: var(--color-dark);
  }

  .btn-primary:hover {
    background-color: #0E5A8A;
  }

  .btn-secondary:hover {
    background-color: #6EB8E0;
  }
</style>
<% } %>
