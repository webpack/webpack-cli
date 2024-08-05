<template>
  <div id="app">
    <img alt="Webpack logo" src="./assets/webpack.png">
    <HelloWorld/>
    <% if (useVueStore) { %>
    <p>Count: {{rawExpression  'mainStore.count' }}</p>
    <button class="btn-primary" @click="mainStore.decrement">Decrement</button>
    <button class="btn-secondary" @click="mainStore.increment">Increment</button>
    <% } %>
  </div>
</template>

<script<% if (langType === 'Typescript') { %> lang="ts"<% } %>>
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
<script<% if (langType === 'Typescript') { %> lang="ts"<% } %> setup>
  <% if (useVueStore) { %>
  import { useMainStore } from './store'
  const mainStore = useMainStore();
  <% } %>
  import HelloWorld from './components/HelloWorld.vue'
</script>

  }
})
</script>
