// Don't modify LoaderOptionsPlugin
module.exports = {
    plugins: [
        new SomePlugin(),
        new webpack.LoaderOptionsPlugin({
            foo: 'bar'
        })
    ]
}
