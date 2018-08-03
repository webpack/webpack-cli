module.export = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
			filename: "commons.js",
			name: "commons"
		})
    ]
}
