const webpack = require("webpack");

module.exports = {
	entry: {
        ed: 'index.js',
        sheeran: "yea, good shit"
    },
	output: {
		filename: "'bundle'",
		path: "'dist/assets'",
		pathinfo: true,
		publicPath: "'https://google.com'",
		sourceMapFilename: "'[name].map'",
		sourcePrefix: jscodeshift("'\t'"),
		umdNamedDefine: true,
		strictModuleExceptionHandling: true
    },
    watchOptions: {
		aggregateTimeout: 100,
		poll: 90,
		ignored: "/ok/"
	},
	watch: 'me',
    context: 'reassign me like one of your french girls',
    devServer: {
        contentBase: "edSheeran",
        compress: true,
        port: 9000,
        empti: "ness"
    },
    devtool: 'eval',
    externals: {
        highdash: {
            commonjs: 'lodash',
            amd: 'lodash'
        }
    },
    performance: {
		hints: "'warning'",
		maxEntrypointSize: 400000,
		maxAssetSize: 100000,
		assetFilter:
			"function(assetFilename) {" +
			"return assetFilename.endsWith('.js');" +
			"}"
	},
    mode: 'development',
    bail: true,
	cache: true,
	profile: true,
	merge: 'NotMuch',
	parallelism: 69,
	recordsInputPath: 'something',
	recordsOutputPath: 'else',
	recordsPath: 'Brooklyn',
	amd: {
		jQuery: true,
		kQuery: false
    },
    resolveLoader: {
		moduleExtensions: [ '-loader' ]
    },
    stats: {
		assets: false,
		assetsSort: "'gold'",
		cached: true,
		cachedAssets: true,
		children: false,
		chunks: true,
    },
    target: 'something',
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
    plugins: ['something'],
	module: {
		rules: [
			{
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["hey", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')",
					inject: "{{#if_eq build 'standalone'}}"
				}
			},
			{
				loader: "'url-loader'",
				inject: "{{#if_eq build 'standalone'}}",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')"
				}
			}
		]
	},
}