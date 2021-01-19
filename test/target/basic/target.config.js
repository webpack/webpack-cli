const WebpackCLITestPlugin = require('../../utils/webpack-cli-test-plugin');

module.exports = {
    entry: './index.js',
    target: 'web',
    mode: 'development',
    plugins: [new WebpackCLITestPlugin()],
};
