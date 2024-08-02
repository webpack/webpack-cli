<template>
  <div id="app">
    <img alt="Webpack logo" src="./assets/webpack.png">
    <HelloWorld/>
  </div>
</template>

<script<% if (langType === 'Typescript') { %> lang="ts"<% } %>>
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  }
})
</script>
