const WebpackCLITestPlugin = require("../../utils/webpack-cli-test-plugin");
const { isDevServer4 } = require("../../utils/test-utils");

module.exports = [
    {
        name: "one",
        mode: "development",
        devtool: false,
        output: {
            publicPath: "/my-public-path/",
            filename: "first-output/[name].js",
        },
        plugins: [new WebpackCLITestPlugin(["mode", "output"], false, "hooks.compilation.taps")],
        devServer: isDevServer4
            ? {
                  client: {
                      logging: "info",
                  },
              }
            : {},
    },
    {
        name: "two",
        mode: "development",
        devtool: false,
        entry: "./src/other.js",
        output: {
            filename: "second-output/[name].js",
        },
    },
];
