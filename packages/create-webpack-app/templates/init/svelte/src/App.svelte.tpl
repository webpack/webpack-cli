<script<% if (langType === 'Typescript') { %> lang="ts"<% } %>>
  import HelloWorld from './components/HelloWorld.svelte';
  import webpackLogo from './assets/webpack.png';
  import { useMainStore } from './store';
  const { count, increment, decrement } = useMainStore();
</script>

<main>
  <div id="app">
    <img alt="Webpack logo" src={webpackLogo}>
    <HelloWorld msg="Hello World"/>
    <p>Count: {$count}</p>
    <button class="btn-primary" on:click={decrement}>Decrement</button>
    <button class="btn-secondary" on:click={increment}>Increment</button>
  </div>
</main>

<% if (isCSS) { %>
<style>
  :root {
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
