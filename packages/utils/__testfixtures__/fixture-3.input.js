module.exports = {
	entry: {
		a: "a.js",
		b: "taddda",
	},
	mode: "prod",
	devServer: {
		port: 9000,
	},
	devtool: "eval",
	plugins: [
		"plugin1",
		"plugin2",
		"plugin3",
	],
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
	},
	module: {
		noParse: function(content) {
			return /jquery|lodash/.test(content);
		},
		rules: [
			{
				loader: "eslint-loader",
				options: {
					formatter: "someOption"
				}
			},
			{
				loader: "vue-loader",
				options: "vueObject"
			},
			{
				loader: "babel-loader",
				include: "asdf"
			}
		]
	}
};
