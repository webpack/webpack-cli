const path = require("node:path");

module.exports = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        entry: "./a",
        output: {
          path: path.resolve(__dirname, "./binary"),
          filename: "promise.js",
        },
      });
    }, 500);
  });
