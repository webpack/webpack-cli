const { defineConfig } = require("webpack");

module.exports = defineConfig(async () => ({
  output: { filename: "./define-config-async-function.js" },
  name: "async-function",
  mode: "development",
}));
