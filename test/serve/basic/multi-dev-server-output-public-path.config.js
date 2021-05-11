const WebpackCLITestPlugin = require('../../utils/webpack-cli-test-plugin');
const { devServerConfig } = require('./helper/base-dev-server.config');
const { isDevServer4 } = require('../../utils/test-utils');

module.exports = [
    {
        name: 'one',
        mode: 'development',
        devtool: false,
        entry: './src/other.js',
        output: {
            filename: 'first-output/[name].js',
        },
        devServer: isDevServer4
            ? {
                  client: {
                      logging: 'info',
                  },
              }
            : {},
    },
    {
        name: 'two',
        mode: 'development',
        devtool: false,
        stats: 'detailed',
        output: {
            publicPath: '/my-public-path/',
            filename: 'second-output/[name].js',
        },
        devServer: devServerConfig,
        plugins: [new WebpackCLITestPlugin(['mode', 'output'], false, 'hooks.compilation.taps')],
    },
];
