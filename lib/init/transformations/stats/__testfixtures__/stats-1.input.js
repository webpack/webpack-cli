module.exports = {
	entry: 'index.js',
	output: {
		filename: 'bundle.js'
	},
	stats: {
		assets: false,
		assetsSort: "'gold'",
		cached: true,
		cachedAssets: true,
		children: false,
		chunks: true,
	}
}
