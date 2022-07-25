const WebpackCLITestPlugin = require("../../../utils/webpack-cli-test-plugin");

module.exports = {
  entry: "./index.js",
  mode: "development",
  target: "web",
  plugins: [new WebpackCLITestPlugin()],
};
