module.export = {
    plugins: [
        new webpack.CommonsChunkPlugin({
            names: ["common", "vendor"]
        })
    ]
}
