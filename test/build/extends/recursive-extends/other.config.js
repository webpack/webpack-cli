const WebpackCLITestPlugin = require("../../../utils/webpack-cli-test-plugin");

module.exports = () => ({
  extends: "./webpack.config.js",
  plugins: [new WebpackCLITestPlugin()],
});
