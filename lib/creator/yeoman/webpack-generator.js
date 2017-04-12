/* eslint-disable quotes */
const Generator = require('yeoman-generator');
const assetFilterFunction = require('webpack-addons').assetFilterFunction;
const externalRegExpFunction = require('webpack-addons').externalRegExpFunction;
const parseValue = require('webpack-addons').parseValue;

module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.configuration = {
			webpackOptions: {},
			topScope: []
		};
	}
	prompting() {
		this.configuration.webpackOptions.entry = {
			vendor: 'home',
			js: 'yes',
			ohye: 'no'
		};
		this.configuration.webpackOptions.output = {};
		this.configuration.webpackOptions.output.filename = "'hello'";
		this.configuration.webpackOptions.output.path = 'path.join(__dirname, "somepath")';
		this.configuration.webpackOptions.output.pathinfo = true;
		this.configuration.webpackOptions.output.publicPath = "'https://newbie.com'";
		this.configuration.webpackOptions.output.sourceMapFilename = "'[name].map'";
		/* eslint-disable */
		this.configuration.webpackOptions.output.sourcePrefix = parseValue("'\t'")
		/* esline-enable */
		this.configuration.webpackOptions.output.umdNamedDefine = true;
		this.configuration.webpackOptions.output.strictModuleExceptionHandling = true;
		this.configuration.webpackOptions.context = 'path.resolve(__dirname, "app")'
		this.configuration.webpackOptions.resolve = {};
		this.configuration.webpackOptions.resolve.alias = {};
		this.configuration.webpackOptions.resolve.alias.hello = ':)'
		this.configuration.webpackOptions.resolve.aliasFields = ["'browser'"]
		this.configuration.webpackOptions.resolve.descriptionFiles = ["'a'", "'b'"]
		this.configuration.webpackOptions.resolve.enforceExtension = false
		this.configuration.webpackOptions.resolve.enforceModuleExtension = false
		this.configuration.webpackOptions.resolve.extensions = ["'hey'", "'gi'"]
		this.configuration.webpackOptions.resolve.mainFields = ["'mod'", "'ho'", "'bo'"]
		this.configuration.webpackOptions.resolve.mainFiles = ["'index'"]
		this.configuration.webpackOptions.resolve.modules = ["'Heo'"]
		this.configuration.webpackOptions.resolve.unsafeCache = true;
		this.configuration.webpackOptions.resolve.plugins = [
			"new webpack.optimize.CommonsChunkPlugin({name:" + "'" + 'vendor' + "'" + ",filename:" + "'" + 'vendor' + "-[hash].min.js'})"
		];
		this.configuration.webpackOptions.resolve.symlinks = true;
		this.configuration.webpackOptions.resolve.cachePredicate = "function()" + "{\n return " + "true" + "\n}";
		this.configuration.webpackOptions.devtool = 'eval'
		this.configuration.webpackOptions.target = 'async-node'
		this.configuration.webpackOptions.watch = true;
		this.configuration.webpackOptions.watchOptions = {
			aggregateTimeout: 300,
			poll: 1000,
			ignored: '/node_modules/'
		}
		this.configuration.webpackOptions.externals = {
			jquery: 'jQuery',
			subtract: 'tracty',
			lodash : {
				commonjs: 'lodash',
				amd: 'lodash',
				root: '_' // indicates global variable
			}
		}
		this.configuration.webpackOptions.externals = [
			externalRegExpFunction('^.js$')
		]
		this.configuration.webpackOptions.externals = /^(jquery|\$)$/i
		this.configuration.webpackOptions.node = {
			console: false,
			global: true,
			process: true,
			Buffer: true,
			__filename: 'mock',
			__dirname: 'mock',
			setImmediate: true
		}
		this.configuration.webpackOptions.performance = {
			hints: "'warning'",
			maxEntrypointSize: 400000,
			maxAssetSize: 100000,
			assetFilter: assetFilterFunction('js')
		}
		this.configuration.webpackOptions.stats = 'errors-only'
		this.configuration.webpackOptions.amd = {
			jQuery: true,
			kQuery: false
		}
		this.configuration.webpackOptions.bail = true;
		this.configuration.webpackOptions.cache = parseValue('myCache')
		this.configuration.webpackOptions.profile = true
		this.configuration.webpackOptions.module = {
			noParse: new RegExp('/jquery|lodash/'),
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
					enforce: 'pre',
					loader: 'babel-loader',
					options: {
						presets: ['es2015']
					},
				},
				{
					test: new RegExp('\\.html$'),
					use: [
						'htmllint-loader',
						{
							loader: 'html-loader',
							options: {
								hello: 'world'
							}
						}
					]
				},
				{ oneOf: [] },
				{ rules: [  ] },
				{ resource: { and: [  ] } },
				{ resource: { or: [  ] } },
				{ resource: [  ] },
				{ resource: { not: 'heo' } }
			],
		}
		this.configuration.webpackOptions.plugins = [
			"new webpack.optimize.CommonsChunkPlugin({name:" + "'" + 'vendor' + "'" + ",filename:" + "'" + 'vendor' + "-[hash].min.js'})"
		]
		this.configuration.topScope = ['const path = require("path");', 'const webpack = require("webpack");', 'const myCache = {};']
	}

};
