module.exports = {
	entry: 'index.js',
	output: {
		filename: 'bundle.js'
	},
	resolve: {
		alias: {
			inject: "{{#if_eq build 'standalone'}}",
			hello: "'world'",
			inject_1: "{{/if_eq}}",
			world: "hello"
		},
		aliasFields: ["'browser'", "wars"],
		descriptionFiles: ["'a'", "b", "'c'"],
		enforceExtension: false,
		enforceModuleExtension: false,
		extensions: ["hey", "ho"],
		mainFields: ["main", "'story'"],
		mainFiles: ["'noMainFileHere'", "iGuess"],
		modules: ["one", "'two'"],
		unsafeCache: false,
		resolveLoader: {
			modules: ["'node_modules'", "mode_nodules"],
			extensions: ["jsVal", "'.json'"],
			mainFields: ["loader", "'main'"],
			moduleExtensions: ["'-loader'", "value"]
		},
		plugins: ["somePlugin", "'stringVal'"],
		symlinks: true
	}
}
