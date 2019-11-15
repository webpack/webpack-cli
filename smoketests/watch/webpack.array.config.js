const webpack = require('webpack');
const { join } = require('path');

module.exports = [
    {
        output: {
            path: join(__dirname, 'binary2'),
            filename: './prod.js',
        },
        mode: 'production',
        devtool: 'eval-cheap-module-source-map',
        target: 'node',
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(true),
            }),
        ],
    },
    {
        output: {
            path: join(__dirname, 'binary'),
            filename: './dev.js',
        },
        mode: 'development',
        target: 'node',
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(false),
            }),
        ],
    },
];
