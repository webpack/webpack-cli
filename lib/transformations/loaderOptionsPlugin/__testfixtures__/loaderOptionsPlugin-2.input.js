// Don't modify LoaderOptionsPlugin
module.exports = {
    plugins: [
        new SomePlugin(),
        new webpack.optimize.LoaderOptionsPlugin({
            foo: 'bar'
        })
    ]
}
