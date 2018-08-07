module.export = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
			names: ["main", "vendor"],
			minChunks: Infinity,
		}),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: "vendor",
		// }),
    ]
}
