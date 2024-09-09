const WebpackCLITestPlugin = require("../../utils/webpack-cli-test-plugin");

module.exports = [
  {
    name: "app",
    dependencies: ["worker"],
    mode: "development",
    devtool: false,
    target: "web",
    entry: "./src/index.js",
    plugins: [new WebpackCLITestPlugin(["mode"], false, "hooks.compilation.taps")],
  },
  {
    name: "worker",
    mode: "development",
    devtool: false,
    target: "webworker",
    entry: "./src/worker.js",
    devServer: false,
  },
];
