module.export = {
    plugins: [
        new webpack.CommonsChunkPlugin({
			name: "main",
            async: true,
            minSize: 0,
            minChunks: 2
		})
    ]
}
