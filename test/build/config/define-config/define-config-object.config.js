const { defineConfig } = require("webpack");

module.exports = defineConfig({
  output: { filename: "./define-config-object.js" },
  name: "object",
  mode: "development",
});
