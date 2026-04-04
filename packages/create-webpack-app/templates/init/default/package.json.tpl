<% const nodeOptions = langType === "Typescript" ? "NODE_OPTIONS='--loader ts-node/esm --no-warnings' " : ""; %>{
  "version": "1.0.0",
  "description": "My webpack project",
  "name": "webpack-project",
  "type": "module",
  "scripts": {
    "build": "<%- nodeOptions %>webpack --mode=production --config-node-env=production <%- langType === 'Typescript' ? ' -c ./webpack.config.ts' : '' %>",
    "build:dev": "<%- nodeOptions %>webpack --mode=development <%- langType === 'Typescript' ? ' -c ./webpack.config.ts' : '' %>",
    <% if (devServer) { %>
      "serve": "<%- nodeOptions %>webpack serve <%- langType === 'Typescript' ? ' -c ./webpack.config.ts' : '' %>",
    <% } %>
    "watch": "<%- nodeOptions %>webpack --watch <%- langType === 'Typescript' ? ' -c ./webpack.config.ts' : '' %>"
  }
}
