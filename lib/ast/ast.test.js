"use strict";

const defineTest = require("../utils/defineTest");
const propTypes = require("../utils/prop-types");

propTypes.forEach(prop => {

	defineTest(
		__dirname,
		prop,
		"fixture-0",
		{
			objects: "are",
			super: [
				"yeah",
				{
					test: new RegExp(/\.(js|vue)$/),
					loader: "'eslint-loader'",
					enforce: "'pre'",
					include: ["customObj", "'Stringy'"],
					options: {
						formatter: "'someOption'"
					}
				}
			],
			nice: "':)'",
			man: "() => duper"
		},
		"init"
	);
});
/*
defineTest(
	__dirname,
	"context",
	"context-0",
	"path.resolve(__dirname, 'app')",
	"init"
);
defineTest(__dirname, "context", "context-1", "'./some/fake/path'", "init");
defineTest(__dirname, "context", "context-2", "contextVariable", "init");

defineTest(__dirname, "context", "context-3", "path.join('dist', mist)", "add");
defineTest(__dirname, "context", "context-4", "'just did'", "add");

defineTest(
	__dirname,
	"devServer",
	"devServer-0",
	{
		contentBase: "path.join(__dirname, 'dist')",
		compress: true,
		port: 9000
	},
	"init"
);
defineTest(__dirname, "devServer", "devServer-1", "someVar", "init");

defineTest(
	__dirname,
	"devServer",
	"devServer-2",
	{
		contentBase: "path.join(__dirname, 'dist')",
		compress: true,
		port: 9000
	},
	"add"
);

defineTest(
	__dirname,
	"devServer",
	"devServer-3",
	{
		contentBase: "path.join(__dirname, 'dist')",
		port: 420
	},
	"add"
);

defineTest(__dirname, "devServer", "devServer-4", "someVar", "add");

defineTest(__dirname, "devtool", "devtool-0", "'source-map'", "init");
defineTest(__dirname, "devtool", "devtool-0", "myVariable", "init");
defineTest(
	__dirname,
	"devtool",
	"devtool-1",
	"'cheap-module-source-map'",
	"init"
);
defineTest(__dirname, "devtool", "devtool-1", "false", "init");

defineTest(__dirname, "devtool", "devtool-2", "'source-map'", "add");
defineTest(__dirname, "devtool", "devtool-3", "myVariable", "add");
defineTest(
	__dirname,
	"devtool",
	"devtool-3",
	"'cheap-module-source-map'",
	"add"
);
defineTest(__dirname, "devtool", "devtool-4", false, "add");
defineTest(__dirname, "devtool", "devtool-4", "false", "add");

defineTest(__dirname, "entry", "entry-0", "'index.js'", "init");
defineTest(__dirname, "entry", "entry-0", ["'index.js'", "'app.js'"], "init");
defineTest(
	__dirname,
	"entry",
	"entry-0",
	{
		index: "'index.js'",
		app: "'app.js'"
	},
	"init"
);

defineTest(
	__dirname,
	"entry",
	"entry-0",
	{
		inject: "something",
		app: "'app.js'",
		inject_1: "else"
	},
	"init"
);
defineTest(__dirname, "entry", "entry-0", "() => 'index.js'", "init");
defineTest(
	__dirname,
	"entry",
	"entry-0",
	"() => new Promise((resolve) => resolve(['./app', './router']))",
	"init"
);
defineTest(__dirname, "entry", "entry-0", "entryStringVariable", "init");

defineTest(__dirname, "entry", "entry-0", "'index.js'", "add");
defineTest(__dirname, "entry", "entry-0", ["'index.js'", "'app.js'"], "add");
defineTest(
	__dirname,
	"entry",
	"entry-1",
	{
		index: "'outdex.js'",
		app: "'nap.js'"
	},
	"add"
);

defineTest(
	__dirname,
	"entry",
	"entry-0",
	{
		inject: "something",
		ed: "'eddy.js'",
		inject_1: "else"
	},
	"add"
);
defineTest(__dirname, "entry", "entry-1", "() => 'index.js'", "add");
defineTest(
	__dirname,
	"entry",
	"entry-0",
	"() => new Promise((resolve) => resolve(['./app', './router']))",
	"add"
);
defineTest(__dirname, "entry", "entry-0", "entryStringVariable", "add");

defineTest(__dirname, "externals", "externals-0", /react/, "init");
defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: "'react'"
	},
	"init"
);

defineTest(__dirname, "externals", "externals-1", "myObj", "init");

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: "reactObj"
	},
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: ["reactObj", "path.join(__dirname, 'app')", "'jquery'"]
	},
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		lodash: {
			commonjs: "'lodash'",
			amd: "'lodash'",
			root: "'_'"
		}
	},
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		lodash: {
			commonjs: "lodash",
			amd: "hidash",
			root: "_"
		}
	},
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	[
		{
			a: "false",
			b: "true",
			"'./ext'": "./hey"
		},
		"function(context, request, callback) {" +
			"if (/^yourregex$/.test(request)){" +
			"return callback(null, 'commonjs ' + request);" +
			"}" +
			"callback();" +
			"}"
	],
	"init"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	[
		"myObj",
		"function(context, request, callback) {" +
			"if (/^yourregex$/.test(request)){" +
			"return callback(null, 'commonjs ' + request);" +
			"}" +
			"callback();" +
			"}"
	],
	"init"
);

/*
defineTest(__dirname, "externals", "externals-0", /react/, "add");
defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'qQuery'",
		react: "'isNowPreact'"
	},
	"add"
);

defineTest(__dirname, "externals", "externals-1", "myObj", "add");

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: "reactObj"
	},
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		jquery: "'jQuery'",
		react: ["reactObj", "path.join(__dirname, 'app')", "'jquery'"]
	},
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-2",
	{
		highdash: {
			commonjs: "'highdash'",
			amd: "'lodash'",
			root: "'_'"
		}
	},
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	{
		lodash: {
			commonjs: "lodash",
			amd: "hidash",
			root: "_"
		}
	},
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	[
		{
			a: "false",
			b: "true",
			"'./ext'": "./hey"
		},
		"function(context, request, callback) {" +
			"if (/^yourregex$/.test(request)){" +
			"return callback(null, 'commonjs ' + request);" +
			"}" +
			"callback();" +
			"}"
	],
	"add"
);

defineTest(
	__dirname,
	"externals",
	"externals-1",
	[
		"myObj",
		"function(context, request, callback) {" +
			"if (/^yourregex$/.test(request)){" +
			"return callback(null, 'commonjs ' + request);" +
			"}" +
			"callback();" +
			"}"
	],
	"add"
);

defineTest(__dirname, "mode", "mode-1", "'production'", "init");
defineTest(__dirname, "mode", "mode-1", "modeVariable", "init");

defineTest(__dirname, "mode", "mode-2", "none", "add");
defineTest(__dirname, "mode", "mode-2", "'production'", "add");

defineTest(
	__dirname,
	"module",
	"module-0",
	{
		rules: [
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				test: new RegExp(/\.vue$/),
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				test: new RegExp(/\.js$/),
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')"
				}
			},
			{
				test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')",
					someArr: ["Hey"]
				}
			}
		]
	},
	"init"
);

defineTest(
	__dirname,
	"module",
	"module-1",
	{
		noParse: /jquery|lodash/,
		rules: [
			{
				test: new RegExp(/\.js$/),
				parser: {
					amd: false
				},
				use: [
					"'htmllint-loader'",
					{
						loader: "'html-loader'",
						options: {
							hello: "'world'"
						}
					}
				]
			}
		]
	},
	"init"
);

defineTest(
	__dirname,
	"module",
	"module-0",
	{
		rules: [
			"{{#if_eq build 'standalone'}}",
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				test: new RegExp(/\.vue$/),
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				test: new RegExp(/\.js$/),
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')",
					inject: "{{#if_eq build 'standalone'}}"
				}
			},
			{
				test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
				loader: "'url-loader'",
				inject: "{{#if_eq build 'standalone'}}",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')"
				}
			}
		]
	},
	"init"
);

defineTest(
	__dirname,
	"module",
	"module-0",
	{
		rules: [
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				test: new RegExp(/\.vue$/),
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				test: new RegExp(/\.js$/),
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')"
				}
			},
			{
				test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')",
					someArr: ["Hey"]
				}
			}
		]
	},
	"init"
);

defineTest(
	__dirname,
	"module",
	"module-1",
	{
		noParse: /jquery|lodash/,
		rules: [
			{
				test: new RegExp(/\.js$/),
				parser: {
					amd: false
				},
				use: [
					"'htmllint-loader'",
					{
						loader: "'html-loader'",
						options: {
							hello: "'world'"
						}
					}
				]
			}
		]
	},
	"add"
);

defineTest(
	__dirname,
	"module",
	"module-2",
	{
		rules: [
			{
				test: new RegExp(/\.(js|vue)$/),
				loader: "'eslint-loader'",
				enforce: "'pre'",
				include: ["customObj", "'Stringy'"],
				options: {
					formatter: "'someOption'"
				}
			},
			{
				test: new RegExp(/\.vue$/),
				loader: "'vue-loader'",
				options: "vueObject"
			},
			{
				test: new RegExp(/\.js$/),
				loader: "'babel-loader'",
				include: ["resolve('src')", "resolve('test')"]
			},
			{
				test: new RegExp(/\.(png|jpe?g|gif|svg)(\?.*)?$/),
				loader: "'url-loader'",
				options: {
					limit: 10000,
					name: "utils.assetsPath('img/[name].[hash:7].[ext]')",
					inject: "{{#if_eq build 'standalone'}}"
				}
			},
			{
				test: new RegExp(/\.(woff2?|eot|ttf|otf)(\?.*)?$/),
				loader: "'url-loader'",
				inject: "{{#if_eq build 'standalone'}}",
				options: {
					limit: "10000",
					name: "utils.assetsPath('fonts/[name].[hash:7].[ext]')"
				}
			}
		]
	},
	"add"
);

defineTest(
	__dirname,
	"node",
	"node-0",
	{
		console: false,
		global: true,
		process: true,
		Buffer: true,
		__filename: "mock",
		__dirname: "mock",
		setImmediate: true
	},
	"init"
);

defineTest(
	__dirname,
	"amd",
	"other-0",
	{
		jQuery: true,
		kQuery: false
	},
	"init"
);
defineTest(__dirname, "bail", "other-0", true, "init");
defineTest(__dirname, "cache", "other-0", true, "init");
defineTest(__dirname, "cache", "other-0", "cacheVal", "init");
defineTest(__dirname, "profile", "other-0", true, "init");
defineTest(__dirname, "merge", "other-0", "myConfig", "init");

defineTest(__dirname, "parallelism", "other-0", 10, "init");
defineTest(
	__dirname,
	"recordsInputPath",
	"other-0",
	"path.join('dist', mine)",
	"init"
);
defineTest(
	__dirname,
	"recordsOutputPath",
	"other-0",
	"path.join('src', yours)",
	"init"
);
defineTest(
	__dirname,
	"recordsPath",
	"other-0",
	"path.join(__dirname, 'records.json')",
	"init"
);

defineTest(
	__dirname,
	"amd",
	"other-1",
	{
		jQuery: false,
		kQuery: true
	},
	"add"
);
defineTest(__dirname, "bail", "other-1", false, "add");
defineTest(__dirname, "cache", "other-1", false, "add");
defineTest(__dirname, "cache", "other-1", "cacheKey", "add");
defineTest(__dirname, "profile", "other-1", false, "add");
defineTest(__dirname, "merge", "other-1", "TheirConfig", "add");

defineTest(__dirname, "parallelism", "other-1", 20, "add");
defineTest(
	__dirname,
	"recordsInputPath",
	"other-1",
	"path.join('dist', ours)",
	"add"
);
defineTest(
	__dirname,
	"recordsOutputPath",
	"other-1",
	"path.join('src', theirs)",
	"add"
);
defineTest(
	__dirname,
	"recordsPath",
	"other-1",
	"path.resolve(__dirname, 'gradle.json')",
	"add"
);

const jscodeshift = require("jscodeshift");

defineTest(
	__dirname,
	"output",
	"output-0",
	{
		filename: "'bundle'",
		path: "'dist/assets'",
		pathinfo: true,
		publicPath: "'https://google.com'",
		sourceMapFilename: "'[name].map'",
		sourcePrefix: jscodeshift("'\t'"),
		umdNamedDefine: true,
		strictModuleExceptionHandling: true
	},
	"init"
);

defineTest(
	__dirname,
	"output",
	"output-1",
	{
		filename: "'app'",
		path: "'distro/src'",
		pathinfo: false,
		publicPath: "'https://google.com'",
		sourcePrefix: jscodeshift("'\t'")
	},
	"add"
);

defineTest(
	__dirname,
	"performance",
	"performance-0",
	{
		hints: "'warning'",
		maxEntrypointSize: 400000,
		maxAssetSize: 100000,
		assetFilter:
			"function(assetFilename) {" +
			"return assetFilename.endsWith('.js');" +
			"}"
	},
	"init"
);

defineTest(
	__dirname,
	"performance",
	"performance-1",
	{
		hints: "'nuclear-warning'",
		maxAssetSize: 6969,
		assetFilter:
			"un(assetFilename) {" + "return assetFilename.endsWith('.js');" + "}"
	},
	"add"
);

defineTest(
	__dirname,
	"plugins",
	"plugins-0",
	[
		"new webpack.optimize.CommonsChunkPlugin({name:" +
			"'" +
			"vendor" +
			"'" +
			",filename:" +
			"'" +
			"vendor" +
			"-[hash].min.js'})"
	],
	"init"
);

defineTest(
	__dirname,
	"plugins",
	"plugins-1",
	"new webpack.optimize.DefinePlugin()",
	"add"
);

defineTest(
	__dirname,
	"plugins",
	"plugins-0",
	"new webpack.optimize.DefinePlugin()",
	"add"
);

defineTest(
	__dirname,
	"resolve",
	"resolve-0",
	{
		alias: {
			inject: "{{#if_eq build 'standalone'}}",
			hello: "'world'",
			inject_1: "{{/if_eq}}",
			world: "hello"
		},
		aliasFields: ["'browser'", "wars"],
		descriptionFiles: ["'a'", "b"],
		enforceExtension: false,
		enforceModuleExtension: false,
		extensions: ["hey", "'ho'"],
		mainFields: ["main", "'story'"],
		mainFiles: ["'noMainFileHere'", "iGuess"],
		modules: ["one", "'two'"],
		unsafeCache: false,
		plugins: ["somePlugin", "'stringVal'"],
		symlinks: true
	},
	"init"
);

defineTest(
	__dirname,
	"resolve",
	"resolve-1",
	{
		alias: {
			inject: "{{#isdf_eq buildasda 'staasdndalone'}}",
			hello: "'worlasdd'",
			inject_1: "{{/asd}}",
			world: "asdc"
		},
		aliasFields: ["'as'"],
		descriptionFiles: ["'d'", "e", "f"],
		enforceExtension: true,
		extensions: ["ok", "'ho'"],
		mainFields: ["ok", "'story'"],
		mainFiles: ["'noMainFileHere'", "niGuess"],
		plugins: ["somePlugin", "'stringVal'"],
		symlinks: false
	},
	"add"
);

defineTest(
	__dirname,
	"resolveLoader",
	"resolveLoader-0",
	{
		modules: ["'ok'", "mode_nodules"],
		mainFields: ["no", "'main'"],
		moduleExtensions: ["'-kn'", "ok"]
	},
	"init"
);

defineTest(
	__dirname,
	"resolveLoader",
	"resolveLoader-1",
	{
		modules: ["'ok'", "mode_nodules"],
		mainFields: ["no", "'main'"],
		moduleExtensions: ["'-kn'", "ok"]
	},
	"add"
);

defineTest(
	__dirname,
	"stats",
	"stats-0",
	{
		assets: true,
		assetsSort: "'field'",
		cached: true,
		cachedAssets: true,
		children: true,
		chunks: true,
		chunkModules: true,
		chunkOrigins: true,
		chunksSort: "'field'",
		context: "'../src/'",
		colors: true,
		depth: false,
		entrypoints: "customVal",
		errors: true,
		errorDetails: true,
		exclude: [],
		hash: true,
		maxModules: 15,
		modules: true,
		modulesSort: "'field'",
		performance: true,
		providedExports: false,
		publicPath: true,
		reasons: true,
		source: true,
		timings: true,
		usedExports: false,
		version: true,
		warnings: true
	},
	"init"
);
defineTest(__dirname, "stats", "stats-0", "'errors-only'", "init");

defineTest(
	__dirname,
	"stats",
	"stats-0",
	{
		assets: true,
		assetsSort: "'naw'",
		cached: true,
		cachedAssets: true,
		children: true,
		chunks: true,
		version: true,
		warnings: false
	},
	"add"
);
defineTest(
	__dirname,
	"stats",
	"stats-1",
	{
		assets: true,
		assetsSort: "'naw'",
		cached: true,
		cachedAssets: true,
		children: true,
		chunks: true,
		version: true,
		warnings: false
	},
	"add"
);
defineTest(__dirname, "stats", "stats-1", "'errors-only'", "add");

defineTest(__dirname, "target", "target-0", "'async-node'", "init");
defineTest(__dirname, "target", "target-1", "node", "init");

defineTest(__dirname, "target", "target-0", "'async-node'", "add");
defineTest(__dirname, "target", "target-1", "'node'", "add");
defineTest(__dirname, "target", "target-2", "'node'", "add");

defineTest(
	__dirname,
	"top-scope",
	"top-scope-0",
	["const test = 'me';"],
	"init"
);
defineTest(
	__dirname,
	"top-scope",
	"top-scope-1",
	["const webpack = require('webpack');"],
	"add"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-0",
	{
		aggregateTimeout: 300,
		poll: 1000,
		ignored: "/node_modules/"
	},
	"init"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-1",
	{
		aggregateTimeout: 300,
		poll: 1000,
		ignored: "/node_modules/"
	},
	"init"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-2",
	{
		aggregateTimeout: 300,
		poll: 1000,
		ignored: "/node_modules/"
	},
	"init"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-0",
	{
		aggregateTimeout: 300,
		poll: 1000,
		ignored: "/node_modules/"
	},
	"add"
);
defineTest(
	__dirname,
	"watchOptions",
	"watch-3",
	{
		poll: 69,
		ignored: "/node_modules/"
	},
	"add"
);

defineTest(
	__dirname,
	"watchOptions",
	"watch-3",
	{
		ignored: "abc"
	},
	"add"
);

defineTest(__dirname, "watch", "watch-0", true, "init");
defineTest(__dirname, "watch", "watch-0", false, "init");
defineTest(__dirname, "watch", "watch-1", true, "init");
defineTest(__dirname, "watch", "watch-1", false, "init");

defineTest(__dirname, "watch", "watch-0", true, "add");
defineTest(__dirname, "watch", "watch-0", false, "add");
defineTest(__dirname, "watch", "watch-4", false, "add");
defineTest(__dirname, "watch", "watch-4", "somehin", "add");
*/
