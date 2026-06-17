const { defineConfig } = require("webpack");

module.exports = defineConfig(() => [
  {
    output: { filename: "./define-config-function-multi-first.js" },
    name: "first",
    entry: "./src/first.js",
    mode: "development",
    stats: "minimal",
  },
  {
    output: { filename: "./define-config-function-multi-second.js" },
    name: "second",
    entry: "./src/second.js",
    mode: "development",
    stats: "minimal",
  },
]);
