module.exports = {
	performance: {
		hints: "'warning'",
		maxEntrypointSize: 400000,
		maxAssetSize: 100000,
		assetFilter:
			"function(assetFilename) {" +
			"return assetFilename.endsWith('.js');" +
			"}"
	}
}
