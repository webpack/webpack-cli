let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HTMLWebpackPlugin = require('html-webpack-plugin');

module.export = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
    ]
}
