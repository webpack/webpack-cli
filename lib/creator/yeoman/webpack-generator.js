const Generator = require('yeoman-generator');

const createCommonsChunkPlugin = require('webpack-addons').createCommonsChunkPlugin;

const Input = require('webpack-addons').Input;
const RawList = require('webpack-addons').RawList;
const CheckList = require('webpack-addons').CheckList;

const entryQuestions = require('./utils/entry');
const OutputQuestions = require('./utils/output');
const getDefaultLoaders = require('./utils/module');
const getDefaultPlugins = require('./utils/plugins');

module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
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

		this.configuration.config.webpackOptions.module = getDefaultLoaders();
		this.configuration.config.webpackOptions.plugins = getDefaultPlugins();
		this.prompt([
			RawList('entryType', 'What kind of entry point do you want?', ['Array', 'Function', 'String', 'Object'])
		]).then( (entryTypeAnswer) => {
			// Ask different questions for entry points
			entryQuestions(self, entryTypeAnswer).then(entryOptions => {
				this.configuration.config.webpackOptions.entry = entryOptions;
			}).then( () => {

				this.prompt([
					CheckList('outputType', 'What kind of output properties do you want?', [
						'chunkFilename',
						'filename',
						'path'
					])
				]).then( (outputTypeAnswer) => {
					// Ask different questions to output
					OutputQuestions(self, outputTypeAnswer['outputType']).then(outputOptions => {
						this.configuration.config.webpackOptions.output = outputOptions;
					}).then( () => {
						// Ask if the user wants to use extractPlugin
						this.prompt([
							Input('extractPlugin', 'If you got a css file, what\'s it named?')
						]).then( (extractAnswer) => {
							if(extractAnswer['extractPlugin'].length !== 0) {
								this.configuration.config.webpackOptions.plugins.push(
									'new ExtractTextPlugin(\'' + extractAnswer['extractPlugin'] + '\')'
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
							// Ask if the user wants to use code splitting
							this.prompt([
								Input('CommonsChunkPlugin', 'If want to use split one entry point, what is it named?')
							]).then( (CommonsChunkPluginAnswer) => {
								if(CommonsChunkPluginAnswer['CommonsChunkPlugin'].length !== 0) {
									this.configuration.config.webpackOptions.plugins.push(
										createCommonsChunkPlugin(CommonsChunkPluginAnswer['CommonsChunkPlugin'])
									);
								}
							}).then( () => {
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
		});
	}

};
