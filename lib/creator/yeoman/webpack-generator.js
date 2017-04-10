const Generator = require('yeoman-generator');
const Input = require('webpack-addons').Input;
const parseArrow = require('../utils/addonsUtils').arrowFunction;
const parsePromise = require('../utils/addonsUtils').dynamicPromise;
const parseFunction = require('../utils/addonsUtils').regularFunction;
const assetFilterFunction = require('../utils/addonsUtils').assetFilterFunction;

module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.configuration = {
			webpackOptions: {
				output: {
					filename: null,
					path: null
				},
				resolve: {
					alias: {},
					aliasFields: []
				}
			}
		};
	}
	prompting() {
		return this.prompt([Input('entry', 'What is the name of the entry point in your application?')])
		.then( (answer) => {
			/*
			let answeri = parsePromise(answer.entry);
			this.configuration.webpackOptions.entry = {
				vendor: 'home',
				js: 'yes',
				ohye: 'no',
				nana: answeri
			};
			this.configuration.webpackOptions.entry = answeri;
			this.configuration.webpackOptions.output.filename = 'hello';
			this.configuration.webpackOptions.output.path = 'dist/assets';
			this.configuration.webpackOptions.output.pathinfo = true;
			this.configuration.webpackOptions.output.publicPath = "https://newbie.com"
			this.configuration.webpackOptions.output.sourceMapFilename = "[name].map"

			// buggy
			this.configuration.webpackOptions.output.sourcePrefix = `${"\t"}`

			this.configuration.webpackOptions.output.umdNamedDefine = true;
			this.configuration.webpackOptions.output.strictModuleExceptionHandling = true;

			this.configuration.webpackOptions.context = '/hello'

			this.configuration.webpackOptions.resolve.alias.hello = ':)'
			this.configuration.webpackOptions.resolve.aliasFields = ["browser"]
			this.configuration.webpackOptions.resolve.descriptionFiles = ['a', 'b']
			this.configuration.webpackOptions.resolve.enforceExtension = false
			this.configuration.webpackOptions.resolve.enforceModuleExtension = false
			this.configuration.webpackOptions.resolve.extensions = ['hey', 'gi']
			this.configuration.webpackOptions.resolve.mainFields = ["mod", 'ho', 'bo']
			this.configuration.webpackOptions.resolve.mainFiles = ["index"]
			this.configuration.webpackOptions.resolve.modules = ["Heo"]
			this.configuration.webpackOptions.resolve.unsafeCache = true
			this.configuration.webpackOptions.resolve.resolveLoader = {
				modules: ["node_modules"],
    			extensions: [".js", ".json"],
    			mainFields: ["loader", "main"],
				moduleExtensions: ['-loader']
			}
			this.configuration.webpackOptions.resolve.plugins = [];
			this.configuration.webpackOptions.resolve.symlinks = true;
			this.configuration.webpackOptions.resolve.cachePredicate = parseFunction(true, 'cachePredicate')
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
				subtract: ['./math', 'subtract'],
				lodash : {
   					commonjs: "lodash",
   					amd: "lodash",
   					root: "_" // indicates global variable
 				}
			}
			this.configuration.webpackOptions.node = {
				console: false,
 				global: true,
 				process: true,
 				Buffer: true,
 				__filename: "mock",
 				__dirname: "mock",
 				setImmediate: true
			}
			this.configuration.webpackOptions.performance = {
  			hints: "warning",
			maxEntrypointSize: 400000,
			maxAssetSize: 100000,
			//buggy
			assetFilter: assetFilterFunction('js')
			}
			this.configuration.webpackOptions.stats = 'errors-only'
			this.configuration.webpackOptions.amd = {
				jQuery: true,
				kQuery: false
			}
			this.configuration.webpackOptions.bail = true;
			let SharedCache = {}
			this.configuration.webpackOptions.cache = SharedCache
			this.configuration.webpackOptions.profile = true
			*/
		});
	}
	config() {}
	childDependencies() {
		this.configuration.childDependencies = ['webpack-addons-preact'];
	}
	inject() {}

};
