"use strict";

const ConcurrencyPlugin = require("./concurrency-plugin");

const child = (name) => ({
  name,
  extends: "./base.config.js",
  entry: `./src/${name}.js`,
  output: { filename: `./dist-${name}.js` },
  plugins: [new ConcurrencyPlugin()],
});

module.exports = Object.assign([child("first"), child("second")], { parallelism: 1 });
