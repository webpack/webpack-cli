const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'stats', 'stats-0', {
	assets: true,
	assetsSort: '\'field\'',
	cached: true,
	cachedAssets: true,
	children: true,
	chunks: true,
	chunkModules: true,
	chunkOrigins: true,
	chunksSort: '\'field\'',
	context: '\'../src/\'',
	colors: true,
	depth: false,
	entrypoints: 'customVal',
	errors: true,
	errorDetails: true,
	exclude: [],
	hash: true,
	maxModules: 15,
	modules: true,
	modulesSort: '\'field\'',
	performance: true,
	providedExports: false,
	publicPath: true,
	reasons: true,
	source: true,
	timings: true,
	usedExports: false,
	version: true,
	warnings: true
});
defineTest(__dirname, 'stats', 'stats-0', '\'errors-only\'');
