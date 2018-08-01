module.export = {
    plugins: [
        new webpack.CommonsChunkPlugin({
            names: ["common", "vendor"],
			minChunks: 2
        })
    ]
}
