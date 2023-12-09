const { join } = require("path");

module.exports = [
  {
    entry: "./src/index.js",
    mode: "production",
    output: {
      path: join(__dirname, "dist1"),
    },
  },
  {
    entry: "./src/index2.js",
    mode: "production",
    output: {
      path: join(__dirname, "dist2"),
    },
  },
];
