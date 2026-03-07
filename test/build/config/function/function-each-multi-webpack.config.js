module.exports = [
  () => ({
    output: {
      filename: "./function-each-first.js",
    },
    name: "first",
    entry: "./src/first.js",
    mode: "development",
    stats: "minimal",
  }),
  async () => ({
    output: {
      filename: "./function-each-second.js",
    },
    name: "second",
    entry: "./src/second.js",
    mode: "development",
    stats: "minimal",
  }),
];
