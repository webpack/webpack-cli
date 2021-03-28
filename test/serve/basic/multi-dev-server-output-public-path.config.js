const WebpackCLITestPlugin = require('../../utils/webpack-cli-test-plugin');

module.exports = [
    {
        name: 'one',
        mode: 'development',
        devtool: false,
        entry: './src/other.js',
        output: {
            filename: 'first-output/[name].js',
        },
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
        devServer: {
            dev: {
                publicPath: '/dev-server-my-public-path/',
            },
        },
        plugins: [new WebpackCLITestPlugin(['mode', 'output'], false, 'hooks.compilation.taps')],
    },
];
