const { defineConfig } = require("webpack");

module.exports = defineConfig(() => ({
  output: { filename: "./define-config-function.js" },
  name: "function",
  mode: "development",
}));
