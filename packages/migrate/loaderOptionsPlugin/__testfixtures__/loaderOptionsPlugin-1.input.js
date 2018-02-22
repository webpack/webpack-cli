module.exports = {
    debug: true,
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.LoaderOptionsPlugin({
            foo: 'bar'
        })
    ]
}
