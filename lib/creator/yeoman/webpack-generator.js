const Generator = require('yeoman-generator');

const createCommonsChunkPlugin = require('webpack-addons').createCommonsChunkPlugin;

const Input = require('webpack-addons').Input;
const InputValidate = require('webpack-addons').InputValidate;
const Confirm = require('webpack-addons').Confirm;

const entryQuestions = require('./utils/entry');
const getBabelPlugin = require('./utils/module');
const getDefaultPlugins = require('./utils/plugins');
const tooltip = require('./utils/tooltip');
const validate = require('./utils/validate');

module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.npmInstalls = ['uglifyjs-webpack-plugin'];
		this.configuration = {
			config: {
				webpackOptions: {},
				topScope: []
			}
		};
	}
	prompting() {

		let done = this.async();
		let self = this;
		let oneOrMoreEntries;

		this.configuration.config.webpackOptions.module = {
			rules: []
		};
		this.configuration.config.webpackOptions.plugins = getDefaultPlugins();
		this.configuration.config.topScope.push(tooltip.uglify());
		this.prompt([
			Confirm('entryType', 'Will you be creating multiple bundles?')
		]).then( (entryTypeAnswer) => {
			// Ask different questions for entry points
			entryQuestions(self, entryTypeAnswer).then(entryOptions => {
				this.configuration.config.webpackOptions.entry = entryOptions;
				oneOrMoreEntries = Object.keys(entryOptions);
			}).then( () => {

				this.prompt([
					InputValidate(
						'outputType',
						'What folder do you want to put those files in?',
						validate
					)
				]).then( (outputTypeAnswer) => {
					if(!this.configuration.config.webpackOptions.entry.length) {
						this.configuration.config.topScope.push(tooltip.commonsChunk());
						this.configuration.config.webpackOptions.output = {
							filename: '\'[name]-[chunkhash].js\'',
							chunkFilename: '\'[chunkhash].js\''
						};
					} else {
						this.configuration.config.webpackOptions.output = {
							filename: '\'[name].bundle.js\'',
						};
					}
					this.configuration.config.webpackOptions.output.path = `'${outputTypeAnswer['outputType']}'`;
				}).then( () => {
					this.prompt([
						Confirm('babelConfirm', 'Will you be using ES2015?')
					]).then( (ans) => {
						if(ans['babelConfirm'] === true) {
							this.configuration.config.webpackOptions.module.rules.push(getBabelPlugin());
							this.npmInstalls = ['babel-loader', 'babel-core', 'babel-preset-env'];
						}
					}).then(() => {
						// Ask if the user wants to use extractPlugin
						this.prompt([
							Input(
								'extractPlugin',
								'What\'s the name of your css file? (press enter to skip)'
							)
						]).then( (extractAnswer) => {
							if(extractAnswer['extractPlugin'].length !== 0) {
								this.configuration.config.topScope.push(tooltip.cssPlugin());
								this.npmInstalls.push('extract-text-webpack-plugin', 'style-loader', 'css-loader');
								this.configuration.config.webpackOptions.plugins.push(
									'new ExtractTextPlugin(\'' + extractAnswer['extractPlugin'] + '.css\')'
								);
								this.configuration.config.webpackOptions.module.rules.push({
									test: new RegExp(/\.css$/),
									use: `ExtractTextPlugin.extract({
										fallback: 'style-loader',
										use: 'css-loader'
									})`
								});
								this.configuration.config.topScope.push(
									'const ExtractTextPlugin = require(\'extract-text-webpack-plugin\');'
								);
							}
						}).then( () => {
							if(!this.configuration.config.webpackOptions.entry.length) {
								oneOrMoreEntries.forEach( (prop) => {
									this.configuration.config.webpackOptions.plugins.push(
										createCommonsChunkPlugin(prop)
									);
								});
							}
							this.configuration.config.topScope.push(
								'const UglifyJSPlugin = require(\'uglifyjs-webpack-plugin\');',
								'\n'
							);
							done();
						});
					});
				});
			});
		});
	}
	installPlugins() {
		this.npmInstall(this.npmInstalls, { 'save-dev': true });
	}

};
