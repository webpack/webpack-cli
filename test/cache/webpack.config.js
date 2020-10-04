const path = require('path');

module.exports = {
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename],
        },
    },
    infrastructureLogging: {
        debug: /webpack\.cache/,
    },
    entry: {
        app: './src/main.js',
    },
    devtool: 'inline-source-map',
    plugins: [],
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
};
