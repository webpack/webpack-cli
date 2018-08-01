module.export = {
    plugins: [
        new webpack.CommonsChunkPlugin({
            names: ["vendor"]
        })
    ]
}
