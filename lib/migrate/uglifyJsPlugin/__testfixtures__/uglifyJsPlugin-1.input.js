const UglifyJsPlugin  = require('uglifyjs-webpack-plugin');
module.exports = {
    devtool: "source-map",
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            compress: {}
        })
    ]
}
