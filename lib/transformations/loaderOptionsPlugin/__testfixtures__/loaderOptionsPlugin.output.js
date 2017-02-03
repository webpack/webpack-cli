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
    debug: true,
    plugins: [
        new webpack.optimize.LoaderOptionsPlugin({
            debug: true
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
