module.exports = function(opts) {
    const webpack = require('webpack');
    const TerserPlugin = require('terser-webpack-plugin');
    const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
    return {
        mode: 'production',
        devtool: 'cheap-module-source-map',
        target: 'web',
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true
                }),
                new OptimizeCSSAssetsPlugin({})
            ],
            splitChunks: {
                chunks: 'all'
            }
        },
    }
}