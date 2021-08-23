const WebpackCLITestPlugin = require("../../utils/webpack-cli-test-plugin");
const { isDevServer4 } = require("../../utils/test-utils");

module.exports = {
  mode: "development",
  devtool: false,
  output: {
    publicPath: "/my-public-path/",
  },
  plugins: [new WebpackCLITestPlugin(["mode", "output"], false, "hooks.compilation.taps")],
  devServer: isDevServer4
    ? {
        client: {
          logging: "info",
        },
      }
    : {},
};
