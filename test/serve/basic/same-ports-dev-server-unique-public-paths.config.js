const WebpackCLITestPlugin = require("../../utils/webpack-cli-test-plugin");
const devServerConfig = require("./helper/base-dev-server.config");

const getGetPort = () => import("get-port");

module.exports = async () => {
  const sharedPort = await (await getGetPort()).default();

  return [
    {
      name: "one",
      mode: "development",
      devtool: false,
      output: {
        publicPath: "/login/",
        filename: "first-output/[name].js",
      },
      devServer: {
        ...devServerConfig,
        port: sharedPort,
        devMiddleware: {
          ...devServerConfig.devMiddleware,
          publicPath: "/login/",
        },
      },
      plugins: [new WebpackCLITestPlugin(["mode", "output"], false, "hooks.compilation.taps")],
    },
    {
      name: "two",
      mode: "development",
      devtool: false,
      entry: "./src/other.js",
      output: {
        publicPath: "/admin/",
        filename: "second-output/[name].js",
      },
      devServer: {
        ...devServerConfig,
        port: sharedPort,
        devMiddleware: {
          ...devServerConfig.devMiddleware,
          publicPath: "/admin/",
        },
      },
      plugins: [new WebpackCLITestPlugin(["mode", "output"], false, "hooks.compilation.taps")],
    },
  ];
};
