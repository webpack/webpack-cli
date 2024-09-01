{
  "version": "1.0.0",

  "description": "My webpack project",

  "name": "webpack-project",
  "scripts": {
    "build": "webpack --mode=production --node-env=production",
    "build:dev": "webpack --mode=development",
    <% if (devServer) { %>
      "serve": "webpack serve",
    <% } %>
    "watch": "webpack --watch"
  }
}
