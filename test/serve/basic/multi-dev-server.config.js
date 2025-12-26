const WebpackCLITestPlugin = require("../../utils/webpack-cli-test-plugin");
const { devServerConfig } = require("./helper/base-dev-server.config");

const getGetPort = () => import("get-port");

module.exports = async () => {
  const port1 = await (await getGetPort()).default();
  const port2 = await (await getGetPort()).default();

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
