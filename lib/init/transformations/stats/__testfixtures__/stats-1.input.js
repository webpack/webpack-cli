module.exports = {
	entry: 'index.js',
	output: {
		filename: 'bundle.js'
	},
	stats: {
		assets: false,
		assetsSort: "'goald'",
		cached: true,
		cachedAssets: true,
		children: false,
		chunks: true,
	}
}
