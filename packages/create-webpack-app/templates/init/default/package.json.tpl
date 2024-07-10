{
  "version": "1.0.0",

  "description": "My webpack project",

  "name": "webpack-project",
  "scripts": {
    "build": "webpack --mode=production --node-env=production",
    "build:dev": "webpack --mode=development",
    "build:prod": "webpack --mode=production --node-env=production",
    <% if (devServer) { %>
      "serve": "webpack serve",
    <% } %>
    "watch": "webpack --watch"
  }
}
