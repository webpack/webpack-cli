const WebpackCLITestPlugin = require('../../utils/webpack-cli-test-plugin');

module.exports = {
    mode: 'development',
    devtool: false,
    plugins: [new WebpackCLITestPlugin(['plugins'], false)],
};
