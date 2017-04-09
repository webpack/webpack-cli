const Generator = require('yeoman-generator');
const Input = require('webpack-addons').Input;


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
			this.configuration.webpackOptions.entry = {
				vendor: 'home',
				js: 'yes',
				ohye: 'no'
			};
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
			this.configuration.webpackOptions.devtool = 'eval'
			this.configuration.webpackOptions.target = 'async-node'
			this.configuration.webpackOptions.watch = true;
			*/
		});
	}
	config() {}
	childDependencies() {
		this.configuration.childDependencies = ['webpack-addons-preact'];
	}
	inject() {}

};
