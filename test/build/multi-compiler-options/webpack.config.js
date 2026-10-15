"use strict";

const ConcurrencyPlugin = require("./concurrency-plugin");

const child = (name) => ({
  name,
  entry: `./src/${name}.js`,
  output: { filename: `./dist-${name}.js` },
  mode: "development",
  plugins: [new ConcurrencyPlugin()],
});

module.exports = Object.assign([child("first"), child("second")], { parallelism: 1 });
