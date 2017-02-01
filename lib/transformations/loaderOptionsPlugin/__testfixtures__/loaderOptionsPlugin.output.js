module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.LoaderOptionsPlugin({
            minimize: true
        })
    ]
}

module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.LoaderOptionsPlugin({
            minimize: true
        })
    ]
}

module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.LoaderOptionsPlugin({
            foo: 'bar',
            minimize: true
        })
    ]
}
