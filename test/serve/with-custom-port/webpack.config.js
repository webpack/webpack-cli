// eslint-disable-next-line node/no-unpublished-require
const WebpackCLITestPlugin = require('../../utils/webpack-cli-test-plugin');

module.exports = {
    mode: 'development',
    devtool: false,
    devServer: {
        port: 1234,
        host: '0.0.0.0',
    },
    plugins: [new WebpackCLITestPlugin(['plugins'], false)],
};
