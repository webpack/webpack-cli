const path = require("node:path");

module.exports = [
  () => ({
    entry: "./a",
    name: "first",
    output: {
      path: path.resolve(__dirname, "./binary"),
      filename: "a-functor.js",
    },
  }),
  () => ({
    entry: "./b",
    name: "second",
    output: {
      path: path.resolve(__dirname, "./binary"),
      filename: "b-functor.js",
    },
  }),
];
