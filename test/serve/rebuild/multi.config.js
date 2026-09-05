const plugins = [
  {
    apply(compiler) {
      compiler.hooks.watchRun.tap("RebuildTest", () => {
        console.log(`Watch ${compiler.name}: ${compiler.watching.watchOptions.aggregateTimeout}`);
      });
      compiler.hooks.afterDone.tap("RebuildTest", () => {
        console.log(`Built ${compiler.name}`);
      });
      compiler.hooks.shutdown.tap("RebuildTest", () => {
        console.log(`Closed ${compiler.name}`);
      });
    },
  },
];

module.exports = [
  {
    name: "app",
    mode: "development",
    entry: "./src/index.js",
    plugins,
    output: { filename: "app.js" },
    watchOptions: {
      aggregateTimeout: 10,
    },
    devServer: {},
  },
  {
    name: "worker",
    mode: "development",
    entry: "./src/worker.js",
    plugins,
    output: { filename: "worker.js" },
    watchOptions: {
      aggregateTimeout: 30,
    },
  },
];
