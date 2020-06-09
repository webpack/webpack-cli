// webpack.config.js
const WebpackCLITestPlugin = require('../webpack-cli-test-plugin');

module.exports = {
    entry: './main.js',
    mode: 'development',
    target: 'node',
    plugins: [new WebpackCLITestPlugin()],
};
