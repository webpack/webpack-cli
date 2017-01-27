module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
}

module.exports = {
    devtool: "source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
}

module.exports = {
    devtool: "cheap-source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {},
            sourceMap: true
        })
    ]
}
