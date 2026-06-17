const { defineConfig } = require("webpack");

module.exports = defineConfig([
  () => ({
    output: { filename: "./define-config-array-first.js" },
    name: "first",
    entry: "./src/first.js",
    mode: "development",
    stats: "minimal",
  }),
  async () => ({
    output: { filename: "./define-config-array-second.js" },
    name: "second",
    entry: "./src/second.js",
    mode: "development",
    stats: "minimal",
  }),
]);
