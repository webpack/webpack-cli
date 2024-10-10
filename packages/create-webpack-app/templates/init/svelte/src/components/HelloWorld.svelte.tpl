<script<% if (langType === 'TypeScript') { %> lang="ts"<% } %>>
<% if (langType === 'TypeScript') { %>

interface Props {
  msg: string;
}

// Declare msg as a reactive statement
export let msg: Props['msg'];
let reactiveMsg = msg;

$: reactiveMsg = msg;

<% } else { %>

// Declare msg as a reactive statement
export let msg;
let reactiveMsg = msg;

$: reactiveMsg = msg;

<% } %>
</script>

<div class="container">
  <h1 class="heading">
    {reactiveMsg}
  </h1>
  <p>
    This is a Webpack + Svelte project.
  </p>
</div>
