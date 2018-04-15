module.exports = {
    devtool: "cheap-source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {}
        })
    ]
}
