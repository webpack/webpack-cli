const { isDevServer4 } = require('../../../utils/test-utils');

let devServerConfig = {};

if (isDevServer4) {
    devServerConfig = {
        dev: {
            publicPath: '/dev-server-my-public-path/',
        },
    };
} else {
    devServerConfig = {
        publicPath: '/dev-server-my-public-path/',
    };
}

module.exports = devServerConfig;
