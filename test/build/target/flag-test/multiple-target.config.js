const WebpackCLITestPlugin = require("../../../utils/webpack-cli-test-plugin");

module.exports = {
  entry: "./index.js",
  mode: "development",
  target: ["web", "es5"],
  plugins: [new WebpackCLITestPlugin()],
};
