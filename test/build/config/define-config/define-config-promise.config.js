const { defineConfig } = require("webpack");

module.exports = defineConfig(
  Promise.resolve({
    output: { filename: "./define-config-promise.js" },
    name: "promise",
    mode: "development",
  }),
);
