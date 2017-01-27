module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
}

module.exports = {
    devtool: "source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({})
    ]
}

module.exports = {
    devtool: "cheap-source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {}
        })
    ]
}
