const path = require("node:path");

module.exports = new Promise((resolve) => {
  setTimeout(() => {
    resolve([
      {
        entry: "./a",
        output: {
          path: path.resolve(__dirname, "./binary"),
          filename: "a-promise.js",
        },
      },
      {
        entry: "./b",
        output: {
          path: path.resolve(__dirname, "./binary"),
          filename: "b-promise.js",
        },
      },
    ]);
  }, 0);
});
