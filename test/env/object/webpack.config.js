const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'eval-module',
    target: 'node',
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
        }),
    ],
};
