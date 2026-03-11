const WebpackCLITestPlugin = require("../../utils/webpack-cli-test-plugin");

module.exports = [
  {
    name: "first",
    plugins: [new WebpackCLITestPlugin()],
  },
  {
    name: "second",
    plugins: [new WebpackCLITestPlugin()],
  },
];
