const Generator = require('yeoman-generator');
const Input = require('webpack-addons').Input;
const parseArrow = require('../utils/addonsUtils').arrowFunction;
const parsePromise = require('../utils/addonsUtils').dynamicPromise;
const parseFunction = require('../utils/addonsUtils').regularFunction;
const assetFilterFunction = require('../utils/addonsUtils').assetFilterFunction;
const externalRegExp = require('../utils/addonsUtils').externalRegExp;
const pureRegExp = require('../utils/addonsUtils').pureRegExp;
const commonChunksPluginCreate = require('../utils/addonsUtils').commonChunksPluginCreate;
const createPathProperty = require('../utils/addonsUtils').createPathProperty;
const createRequire = require('../utils/addonsUtils').createRequire;
const createObject = require('../utils/addonsUtils').createObject;
const moduleRegExp = require('../utils/addonsUtils').moduleRegExp;

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
			},
			topScope: []
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
			this.configuration.webpackOptions.output.path = createPathProperty('path.resolve', '__dirname', answer.entry);
			this.configuration.webpackOptions.output.pathinfo = true;
			this.configuration.webpackOptions.output.publicPath = "https://newbie.com"
			this.configuration.webpackOptions.output.sourceMapFilename = "[name].map"

			this.configuration.webpackOptions.output.sourcePrefix = pureRegExp("'\t'")

			this.configuration.webpackOptions.output.umdNamedDefine = true;
			this.configuration.webpackOptions.output.strictModuleExceptionHandling = true;

			this.configuration.webpackOptions.context = createPathProperty('path.resolve', '__dirname', "app")

			this.configuration.webpackOptions.resolve.alias.hello = ':)'
			this.configuration.webpackOptions.resolve.aliasFields = ["browser"]
			this.configuration.webpackOptions.resolve.descriptionFiles = ['a', 'b']
			this.configuration.webpackOptions.resolve.enforceExtension = false
			this.configuration.webpackOptions.resolve.enforceModuleExtension = false
			this.configuration.webpackOptions.resolve.extensions = ['hey', 'gi']
			this.configuration.webpackOptions.resolve.mainFields = ["mod", 'ho', 'bo']
			this.configuration.webpackOptions.resolve.mainFiles = ["index"]
			this.configuration.webpackOptions.resolve.modules = ["Heo"]
			this.configuration.webpackOptions.resolve.unsafeCache = true;
			this.configuration.webpackOptions.resolve.plugins = [
				commonChunksPluginCreate('myChunk')
			];
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
				subtract: 'tracty',
				lodash : {
   					commonjs: "lodash",
   					amd: "lodash",
   					root: "_" // indicates global variable
 				}
			}

			//this.configuration.webpackOptions.externals = [
			//	externalRegExp('^.js$')
		//	]

		//	this.configuration.webpackOptions.externals = /^(jquery|\$)$/i
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

			assetFilter: assetFilterFunction('js')
			}
			this.configuration.webpackOptions.stats = 'errors-only'
			this.configuration.webpackOptions.amd = {
				jQuery: true,
				kQuery: false
			}
			this.configuration.webpackOptions.bail = true;
			this.configuration.webpackOptions.cache = pureRegExp('myCache')
			this.configuration.webpackOptions.profile = true
			this.configuration.webpackOptions.module = {
				noParse: pureRegExp('/jquery|lodash/'),
    rules: [
      // rules for modules (configure loaders, parser options, etc.)

      {
        test: pureRegExp("/\.jsx?$/"),
        include: [
			createPathProperty('path.resolve', "'../'", 'app')
        ],
        exclude: [
			createPathProperty('path.resolve', "'../app'", 'demo-files')
        ],
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preferrence over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include

        // conditions for the issuer (the origin of the import)

        enforce: "pre",
        // flags to apply these rules, even if they are overridden (advanced option)

        loader: "babel-loader",
        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide

        options: {
          presets: ["es2015"]
        },
        // options for the loader
      },

      {
        test: new RegExp("\\.html$"),

        use: [
          // apply multiple loaders and options
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
				hello: 'world'
            }
          }
        ]
      },

      { oneOf: [] },
      // only use one of these nested rules

      { rules: [  ] },
      // use all of these nested rules (combine with conditions to be useful)

      { resource: { and: [  ] } },
      // matches only if all conditions are matched

      { resource: { or: [  ] } },
      { resource: [  ] },
      // matches if any condition is matched (default for arrays)

      { resource: { not: 'heo' } }
      // matches if the condition is not matched
    ],
			}
			this.configuration.webpackOptions.plugins = [
				commonChunksPluginCreate('myChunk'),
				commonChunksPluginCreate('vendor'),
				commonChunksPluginCreate('fp')
			]
			this.configuration.topScope = [createRequire('path'), createRequire('webpack'), createObject('const myCache = {};')]
			*/
		});
	}
	config() {}
	inject() {}

};
