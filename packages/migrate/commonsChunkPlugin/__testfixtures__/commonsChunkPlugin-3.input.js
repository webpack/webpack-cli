module.export = {
    plugins: [
        new webpack.CommonsChunkPlugin({
			filename: "commons.js",
			name: "commons"
		})
    ]
}
