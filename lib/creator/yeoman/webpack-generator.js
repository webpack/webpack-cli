/* eslint-disable quotes */
const Generator = require('yeoman-generator');
const assetFilterFunction = require('webpack-addons').assetFilterFunction;
const externalRegExpFunction = require('webpack-addons').externalRegExpFunction;
const parseValue = require('webpack-addons').parseValue;

module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.configuration = {
			dev: {
				webpackOptions: {},
				topScope: []
			}
		};
	}
	prompting() {
		this.configuration.dev.webpackOptions.entry = {
			vendor: 'home',
			js: 'yes',
			ohye: 'no'
		};
		this.configuration.dev.webpackOptions.output = {};
		this.configuration.dev.webpackOptions.output.filename = "'hello'";
		this.configuration.dev.webpackOptions.output.path = 'path.join(__dirname, "somepath")';
		this.configuration.dev.webpackOptions.output.pathinfo = true;
		this.configuration.dev.webpackOptions.output.publicPath = "'https://newbie.com'";
		this.configuration.dev.webpackOptions.output.sourceMapFilename = "'[name].map'";
		/* eslint-disable */
		this.configuration.dev.webpackOptions.output.sourcePrefix = parseValue("'\t'")
		/* esline-enable */
		this.configuration.dev.webpackOptions.output.umdNamedDefine = true;
		this.configuration.dev.webpackOptions.output.strictModuleExceptionHandling = true;
		this.configuration.dev.webpackOptions.context = 'path.resolve(__dirname, "app")'
		this.configuration.dev.webpackOptions.resolve = {};
		this.configuration.dev.webpackOptions.resolve.alias = {};
		this.configuration.dev.webpackOptions.resolve.alias.hello = '\':)\''
		this.configuration.dev.webpackOptions.resolve.aliasFields = ["'browser'"]
		this.configuration.dev.webpackOptions.resolve.descriptionFiles = ["'a'", "'b'"]
		this.configuration.dev.webpackOptions.resolve.enforceExtension = false
		this.configuration.dev.webpackOptions.resolve.enforceModuleExtension = false
		this.configuration.dev.webpackOptions.resolve.extensions = ["'hey'", "'gi'"]
		this.configuration.dev.webpackOptions.resolve.mainFields = ["'mod'", "'ho'", "'bo'"]
		this.configuration.dev.webpackOptions.resolve.mainFiles = ["'index'"]
		this.configuration.dev.webpackOptions.resolve.modules = ["'Heo'"]
		this.configuration.dev.webpackOptions.resolve.unsafeCache = true;
		this.configuration.dev.webpackOptions.resolve.plugins = [
			"new webpack.optimize.CommonsChunkPlugin({name:" + "'" + 'vendor' + "'" + ",filename:" + "'" + 'vendor' + "-[hash].min.js'})"
		];
		this.configuration.dev.webpackOptions.resolve.symlinks = true;
		this.configuration.dev.webpackOptions.resolve.cachePredicate = "function()" + "{\n return " + "true" + "\n}";
		this.configuration.dev.webpackOptions.devtool = 'eval'
		this.configuration.dev.webpackOptions.target = 'async-node'
		this.configuration.dev.webpackOptions.watch = true;
		this.configuration.dev.webpackOptions.watchOptions = {
			aggregateTimeout: 300,
			poll: 1000,
			ignored: '/node_modules/'
		}
		this.configuration.dev.webpackOptions.externals = {
			jquery: 'jQuery',
			subtract: 'tracty',
			lodash : {
				commonjs: 'lodash',
				amd: 'lodash',
				root: '_' // indicates global variable
			}
		}
		this.configuration.dev.webpackOptions.externals = [
			externalRegExpFunction('^.js$')
		]
		this.configuration.dev.webpackOptions.externals = /^(jquery|\$)$/i
		this.configuration.dev.webpackOptions.node = {
			console: false,
			global: true,
			process: true,
			Buffer: true,
			__filename: 'mock',
			__dirname: 'mock',
			setImmediate: true
		}
		this.configuration.dev.webpackOptions.performance = {
			hints: "'warning'",
			maxEntrypointSize: 400000,
			maxAssetSize: 100000,
			assetFilter: assetFilterFunction('js')
		}
		this.configuration.dev.webpackOptions.stats = 'errors-only'
		this.configuration.dev.webpackOptions.amd = {
			jQuery: true,
			kQuery: false
		}
		this.configuration.dev.webpackOptions.bail = true;
		this.configuration.dev.webpackOptions.cache = 'myCache'
		this.configuration.dev.webpackOptions.profile = true
		this.configuration.dev.webpackOptions.module = {
			noParse: new RegExp(/jquery|lodash/),
			rules: [
				{
					test: new RegExp('/\.jsx?$/'),
					include: [
						/* eslint-disable */
						'path.resolve(__dirname, "app")'
						/* eslint-enable */
					],
					exclude: [
						/* eslint-disable */
						'path.resolve(__dirname, ".." , "app", "demo-files")'
						/* eslint-enable */
					],
					enforce: "'pre'",
					loader: "'babel-loader'",
					options: {
						presets: ['es2015']
					},
				},
				{
					test: new RegExp('\\.html$'),
					use: [
						"'htmllint-loader'",
						{
							loader: "'html-loader'",
							options: {
								hello: "'world'"
							}
						}
					]
				},
			],
		}
		this.configuration.dev.webpackOptions.plugins = [
			"new webpack.optimize.CommonsChunkPlugin({name:" + "'" + 'vendor' + "'" + ",filename:" + "'" + 'vendor' + "-[hash].min.js'})"
		]
		this.configuration.dev.topScope = ['const path = require("path");', 'const webpack = require("webpack");', 'const myCache = {};']
		this.configuration.dev.configName = 'dev';
	}

};
