const { defineConfig } = require("webpack");

module.exports = defineConfig(
  Promise.resolve([
    {
      output: { filename: "./define-config-promise-multi-first.js" },
      name: "first",
      entry: "./src/first.js",
      mode: "development",
      stats: "minimal",
    },
    {
      output: { filename: "./define-config-promise-multi-second.js" },
      name: "second",
      entry: "./src/second.js",
      mode: "development",
      stats: "minimal",
    },
  ]),
);
