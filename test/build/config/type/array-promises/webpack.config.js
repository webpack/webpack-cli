const path = require("node:path");

module.exports = [
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        entry: "./a",
        name: "first",
        output: {
          path: path.resolve(__dirname, "./binary"),
          filename: "a-promise.js",
        },
      });
    }, 0);
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        entry: "./b",
        name: "second",
        output: {
          path: path.resolve(__dirname, "./binary"),
          filename: "b-promise.js",
        },
      });
    }, 0);
  }),
];
