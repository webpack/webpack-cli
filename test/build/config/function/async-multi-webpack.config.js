module.exports = async () => [
  {
    output: {
      filename: "./multi-async-first.js",
    },
    name: "first",
    entry: "./src/first.js",
    mode: "development",
    stats: "minimal",
  },
  {
    output: {
      filename: "./multi-async-second.js",
    },
    name: "second",
    entry: "./src/second.js",
    mode: "development",
    stats: "minimal",
  },
];
