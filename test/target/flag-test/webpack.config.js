const WebpackCLITestPlugin = require('../../utils/webpack-cli-test-plugin');

module.exports = {
    entry: './index.js',
    mode: 'production',
    target: 'node',
    plugins: [new WebpackCLITestPlugin()],
};
