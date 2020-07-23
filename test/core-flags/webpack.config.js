const WebpackCLITestPlugin = require('../utils/webpack-cli-test-plugin');

module.exports = {
    entry: './main.js',
    mode: 'development',
    name: 'compiler',
    plugins: [new WebpackCLITestPlugin(['module'])],
};
