<template>
  <div class="container">
    <h1 class="heading">Hello World</h1>
    <p>
      This is a Webpack + Vue 3 project.
    </p>
  </div>
</template>

<script<% if (langType === 'Typescript') { %> lang="ts"<% } %>>
import { defineComponent<% if (langType === 'Typescript') { %>, PropType<% } %> } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String<% if (langType === 'Typescript') { %> as PropType<string><% } %>,
      required: true
    }
  }
})
</script>
