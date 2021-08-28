const { isDevServer4 } = require("../../../utils/test-utils");

let devServerConfig = {};

if (isDevServer4) {
  devServerConfig = {
    devMiddleware: {
      publicPath: "/dev-server-my-public-path/",
    },
    client: {
      logging: "info",
    },
  };
} else {
  devServerConfig = {
    publicPath: "/dev-server-my-public-path/",
  };
}

module.exports = devServerConfig;
