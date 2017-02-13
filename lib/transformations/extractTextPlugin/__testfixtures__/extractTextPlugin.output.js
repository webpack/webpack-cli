let ExtractTextPlugin = require('extract-text-webpack-plugin');

let extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
let extractLESS = new ExtractTextPlugin('stylesheets/[name].less');

module.export = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
    ]
}
