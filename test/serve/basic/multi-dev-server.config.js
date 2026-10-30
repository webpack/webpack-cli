const { getFreePort } = require("../../utils/test-utils");
const WebpackCLITestPlugin = require("../../utils/webpack-cli-test-plugin");
const { devServerConfig } = require("./helper/base-dev-server.config");

module.exports = async () => {
  const port1 = await getFreePort();
  const port2 = await getFreePort();

  return [
    {
      name: "one",
      mode: "development",
      devtool: false,
      output: {
        filename: "first-output/[name].js",
      },
      devServer: {
        ...devServerConfig,
        port: port1,
      },
      plugins: [new WebpackCLITestPlugin(["mode", "output"], false, "hooks.compilation.taps")],
    },
    {
      name: "two",
      mode: "development",
      devtool: false,
      entry: "./src/other.js",
      output: {
        filename: "second-output/[name].js",
      },
      devServer: {
        ...devServerConfig,
        port: port2,
      },
    },
  ];
};
