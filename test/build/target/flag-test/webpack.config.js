const WebpackCLITestPlugin = require("../../../utils/webpack-cli-test-plugin");

module.exports = {
  entry: "./index.js",
  mode: "development",
  plugins: [new WebpackCLITestPlugin()],
};
