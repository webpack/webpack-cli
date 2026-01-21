const path = require("node:path");

class InfiniteWaitPlugin {
  apply(compiler) {
    compiler.hooks.shutdown.tapPromise("Graceful Exit Test", async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    });
  }
}

module.exports = {
  mode: "development",
  name: "cache-graceful-shutdown",
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
  },
  plugins: [new InfiniteWaitPlugin()],
};
