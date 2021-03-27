// eslint-disable-next-line node/no-unpublished-require
const getPort = require('get-port');

const WebpackCLITestPlugin = require('../../utils/webpack-cli-test-plugin');

module.exports = async () => [
    {
        name: 'one',
        mode: 'development',
        devtool: false,
        output: {
            filename: 'first-output/[name].js',
        },
        devServer: {
            port: await getPort(),
            publicPath: '/one-dev-server-my-public-path/',
        },
        plugins: [new WebpackCLITestPlugin(['mode', 'output'], false, 'hooks.compilation.taps')],
    },
    {
        name: 'two',
        mode: 'development',
        devtool: false,
        entry: './src/other.js',
        output: {
            filename: 'second-output/[name].js',
        },
        devServer: {
            port: await getPort(),
            publicPath: '/two-dev-server-my-public-path/',
        },
    },
];
