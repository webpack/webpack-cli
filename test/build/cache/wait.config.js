const path = require("path");
const InfiniteWaitPlugin = require("../../utils/infinite-wait-plugin");

module.exports = {
  mode: "development",
  name: "cache-test-default",
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
