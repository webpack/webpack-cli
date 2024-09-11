<script<% if (langType === 'TypeScript') { %> lang="ts"<% } %> setup>
<% if (langType === 'TypeScript') { %>

interface Props {
  msg: string
}

const props = defineProps<Props>()
<% } else { %>

const props = defineProps({
  msg: {
    type: String,
    required: true
  }
})
<% } %>
</script>
<template>
  <div class="container">
    <h1 class="heading">
     {{ msg }}
    </h1>
    <p>
      This is a Webpack + Vue 3 project.
    </p>
  </div>
</template>
