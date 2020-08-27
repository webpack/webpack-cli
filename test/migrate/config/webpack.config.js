/* eslint-disable */
const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
        vendor: './src/vendor.js',
    },

    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
    },

    optimization: {
        minimize: true
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['@babel/preset-env'],
                },
            },
        ],
    },
};
