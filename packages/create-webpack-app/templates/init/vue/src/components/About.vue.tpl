<template>
  <main>
    <div id="app">
      <img alt="Webpack logo" :src="webpackLogo" />
      <h1 class="heading">
        This is the <span>About</span> page!
      </h1>
      <p>
        This is a webpack + {{ rawExpression 'msg' }} project.
      </p>
    </div>
  </main>
</template>

<script<% if (langType === 'TypeScript') { %> lang="ts"<% } %> setup>
import webpackLogo from '../assets/webpack.png';

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
