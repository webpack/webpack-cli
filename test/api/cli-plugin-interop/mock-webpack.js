// Minimal webpack stand-in (loaded via WEBPACK_PACKAGE): captures the config
// webpack-cli assembles so tests can assert on the applied plugins.
const realWebpack = require("webpack");

const webpack = (options) => {
  globalThis.__capturedWebpackOptions = options;

  return { options };
};

webpack.cli = realWebpack.cli;
webpack.version = realWebpack.version;

module.exports = webpack;
