const WebpackCLITestPlugin = require('../utils/webpack-cli-test-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    plugins: [new WebpackCLITestPlugin(['plugins'], false)],
};
