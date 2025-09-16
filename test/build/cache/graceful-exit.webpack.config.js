const path = require("node:path");

class InfiniteWaitPlugin {
  constructor(options = {}) {
    this.wait = options.wait || 10e3;
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise("Graceful Exit Test", async () => {
      // eslint-disable-next-line no-new
      new Promise((res) => {
        setTimeout(res, this.wait);
      });
    });
  }
}

module.exports = {
  mode: "development",
  name: "graceful-exit-test",
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  infrastructureLogging: {
    debug: /cache/,
  },
  entry: {
    app: "./src/main.js",
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [new InfiniteWaitPlugin()],
};
