const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
        }),
    ],
};
