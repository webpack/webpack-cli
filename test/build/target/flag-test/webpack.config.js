const WebpackCLITestPlugin = require("../../../utils/webpack-cli-test-plugin");

module.exports = {
  entry: "./index.js",
  mode: "development",
  target: "node",
  plugins: [new WebpackCLITestPlugin()],
  resolve: {
    fallback: {
      url: false,
    },
  },
};
