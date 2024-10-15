<template>
  <div id="app">
    <img alt="Webpack logo" src="../assets/webpack.png">
    <h1 class="heading">This is the <span>Home</span> page!</h1>
    <p> Click the buttons below to increment and decrement the count.</p>
    <% if (useVueStore) { %>
    <p>Count: {{ mainStore.count }}</p>
    <button class="btn-primary" @click="mainStore.decrement">Decrement</button>
    <button class="btn-secondary" @click="mainStore.increment">Increment</button>
    <% } %>
  </div>
</template>

<script<% if (langType === 'Typescript') { %> lang="ts"<% } %> setup>
  <% if (useVueStore) { %>
  import { useMainStore } from '../store'
  const mainStore = useMainStore();
  <% } %>
</script>
