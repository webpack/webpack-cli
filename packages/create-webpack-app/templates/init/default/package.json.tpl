{
  "version": "1.0.0",
  "description": "My webpack project",
  "name": "webpack-project",
  "type": "module",<% if (langType === "Typescript") { %>
  "engines": {
    "node": ">=22.6.0"
  },<% } %>
  "scripts": {
    "build": "webpack --mode=production --config-node-env=production",
    "build:dev": "webpack --mode=development",
    <% if (devServer) { %>
      "serve": "webpack serve",
    <% } %>
    "watch": "webpack --watch"<% if (langType === "Typescript") { %>,
    "check:types": "tsc --noEmit"<% } %>
  }
}
