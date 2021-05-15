const WebpackCLITestPlugin = require("../../utils/webpack-cli-test-plugin");
const { isDevServer4 } = require("../../utils/test-utils");

module.exports = {
    mode: "development",
    devtool: false,
    plugins: [new WebpackCLITestPlugin(["mode"], false, "hooks.compilation.taps")],
    devServer: isDevServer4
        ? {
              client: {
                  logging: "info",
              },
          }
        : {},
};
