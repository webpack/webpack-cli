module.exports = function(opts) {
    const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
    const webpack = require('webpack');
    const TerserPlugin = require('terser-webpack-plugin');

    return {
        mode: 'production',
        devtool: 'cheap-module-source-map',
        target: 'web',
        output: {
            chunkFilename: 'chunks/[name].chunk.js?t=' + new Date().getTime(),
        },
        module: {
            rules: [{
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }]
        },
        plugins: [
            new HardSourceWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }),
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