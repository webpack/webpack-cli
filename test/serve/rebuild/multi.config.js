module.exports = [
  {
    name: "app",
    mode: "development",
    entry: "./src/index.js",
    output: { filename: "app.js" },
    watchOptions: {
      aggregateTimeout: 10,
    },
    devServer: {},
  },
  {
    name: "worker",
    mode: "development",
    entry: "./src/index.js",
    output: { filename: "worker.js" },
    watchOptions: {
      aggregateTimeout: 10,
    },
  },
];
