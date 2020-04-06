/* eslint-disable */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

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

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,

                use: [{
                    loader: 'babel-loader',

                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }]
            },
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style',
                    use: 'css!sass'
                }),
            },
        ],
    },

    plugins: [new ExtractTextPlugin('styles-[contentHash].css'), new HtmlWebpackPlugin()],

    optimization: {
        minimize: true
    },

    optimizations: {
        splitChunks: {
            cacheGroups: {
                common: {
                    name: 'common',
                    chunks: 'initial',
                    enforce: true,
                    minChunks: 2,
                    filename: 'common-[hash].min.js'
                }
            }
        }
    }
};