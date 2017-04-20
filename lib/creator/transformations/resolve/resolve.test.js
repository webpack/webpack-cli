const defineTest = require('../../../transformations/defineTest');

defineTest(__dirname, 'resolve', 'resolve-0', {resolve: {
	alias: {
		hello: '\'world\'',
		world: 'hello'
	},
	aliasFields: ['\'browser\'', 'wars'],
	descriptionFiles: ['\'a\'', 'b'],
	enforceExtension: false,
	enforceModuleExtension: false,
	extensions: ['hey', '\'ho\''],
	mainFields: ['main', '\'story\''],
	mainFiles: ['\'noMainFileHere\'', 'iGuess'],
	modules: ['one', '\'two\''],
	unsafeCache: false,
	resolveLoader: {
		modules: ['\'node_modules\'', 'mode_nodules'],
		extensions: ['jsVal', '\'.json\''],
		mainFields: ['loader', '\'main\''],
		moduleExtensions: ['\'-loader\'', 'value']
	},
	plugins: ['somePlugin', '\'stringVal\''],
	symlinks: true
}});
