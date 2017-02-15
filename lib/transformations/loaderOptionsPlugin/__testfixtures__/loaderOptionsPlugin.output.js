module.exports = {
    debug: true,
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.LoaderOptionsPlugin({
            foo: 'bar',
            'debug': true,
            'minimize': true
        })
    ]
}
