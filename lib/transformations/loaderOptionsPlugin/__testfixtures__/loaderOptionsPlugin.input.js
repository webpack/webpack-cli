module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
}

module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.LoaderOptionsPlugin()
    ]
}

module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.LoaderOptionsPlugin({
            foo: 'bar'
        })
    ]
}
