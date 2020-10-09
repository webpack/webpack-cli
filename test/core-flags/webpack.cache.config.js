const WebpackCLITestPlugin = require('../utils/webpack-cli-test-plugin');

module.exports = {
    entry: './src/main.js',
    mode: 'development',
    cache: {
        type: 'filesystem',
    },
    name: 'compiler',
    plugins: [new WebpackCLITestPlugin(['module', 'entry', 'resolve', 'resolveLoader'])],
};
