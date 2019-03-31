module.exports = (chunkType) => {
	// ref : https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
	return (
		`
		splitChunks: {
			chunks: '${chunkType}',
			cacheGroups: {
				vendors: {
				  test: /[\\/]node_modules[\\/]/,
				  priority: -10,
				  filename: '[name].bundle.js'
				},
				default: {
				  minChunks: 2,
				  priority: -20,
				  reuseExistingChunk: true
				}
			  }
		  }
		`
	);
};
