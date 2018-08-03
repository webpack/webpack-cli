module.export = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["common", "vendor"],
			minChunks: 2
        })
    ]
}
