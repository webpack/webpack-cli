const Generator = require('yeoman-generator');

const createCommonsChunkPlugin = require('webpack-addons').createCommonsChunkPlugin;

const Input = require('webpack-addons').Input;
const InputValidate = require('webpack-addons').InputValidate;
const Confirm = require('webpack-addons').Confirm;
const RawList = require('webpack-addons').RawList;

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
		let regExpForStyles;
		let ExtractUseProps;

		this.configuration.config.webpackOptions.module = {
			rules: []
		};
		this.configuration.config.webpackOptions.plugins = getDefaultPlugins();
		this.configuration.config.topScope.push(
			tooltip.uglify(),
			'const UglifyJSPlugin = require(\'uglifyjs-webpack-plugin\');',
			'\n'
		);
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
					}).then( () => {
						this.prompt([
							RawList(
								'stylingType',
								'Will you use one of the below CSS solutions?',
								['SASS', 'LESS', 'CSS', 'PostCSS', 'No']
							)
						]).then( (stylingAnswer) => {
							if(stylingAnswer['stylingType'] === 'SASS') {
								this.npmInstalls.push(
									'sass-loader', 'node-sass',
									'style-loader', 'css-loader'
								);
								regExpForStyles = new RegExp(/\.(scss|css)$/);
								ExtractUseProps = `use: [{
									loader: 'css-loader',
									options: {
										sourceMap: true
									}
								}, {
									loader: 'sass-loader',
									options: {
										sourceMap: true
									}
								}],
								fallback: 'style-loader'`;
							}
							else if(stylingAnswer['stylingType'] === 'LESS') {
								regExpForStyles = new RegExp(/\.(less|css)$/);
								this.npmInstalls.push(
									'less-loader', 'less',
									'style-loader', 'css-loader'
								);
								ExtractUseProps = `
									use: [{
										loader: 'css-loader',
										options: {
											sourceMap: true
										}
									}, {
										loader: 'less-loader',
										options: {
											sourceMap: true
										}
									}],
									fallback: 'style-loader'`;

							}
							else if(stylingAnswer['stylingType'] === 'PostCSS') {
								this.configuration.config.topScope.push(
									tooltip.postcss(),
									'const autoprefixer = require(\'autoprefixer\');',
									'const precss = require(\'precss\');'
								);
								this.npmInstalls.push(
									'style-loader', 'css-loader',
									'postcss-loader', 'precss',
									'autoprefixer'
								);
								regExpForStyles = new RegExp(/\.css$/);
								ExtractUseProps = `
									use: [{
										loader: 'style-loader'
									},{
										loader: 'css-loader',
										options: {
											sourceMap: true,
											importLoaders: 1
										}
									}, {
										loader: 'postcss-loader',
										options: {
											plugins: function () {
												return [
													precss,
													autoprefixer
												];
											}
										}
									}],
									fallback: 'style-loader'`;
							}
							else if(stylingAnswer['stylingType'] === 'CSS') {
								this.npmInstalls.push('style-loader', 'css-loader');
								regExpForStyles = new RegExp(/\.css$/);
								ExtractUseProps = `use: [{
									loader: 'css-loader',
									options: {
										sourceMap: true
									}
								}],
								fallback: 'style-loader'`;
							}
							else {
								regExpForStyles = null;
							}
						}).then( () => {
							// Ask if the user wants to use extractPlugin
							this.prompt([
								Input(
									'extractPlugin',
									'What\'s the name of your bundled css file? (press enter to skip)'
								)
							]).then( (extractAnswer) => {
								if(regExpForStyles) {
									this.configuration.config.topScope.push(tooltip.cssPlugin());
									this.npmInstalls.push('extract-text-webpack-plugin');
									if(extractAnswer['extractPlugin'].length !== 0) {
										this.configuration.config.webpackOptions.plugins.push(
											'new ExtractTextPlugin(\'' +
											extractAnswer['extractPlugin'] +
											'.css\')'
										);
									} else {
										this.configuration.config.webpackOptions.plugins.push(
											'new ExtractTextPlugin(\'' +
											'style.css\')'
										);
									}
									const moduleRulesObj = {
										test: regExpForStyles,
										use: `ExtractTextPlugin.extract({
											${ExtractUseProps}
										})`
									};
									this.configuration.config.webpackOptions.module.rules.push(moduleRulesObj);
									this.configuration.config.topScope.push(
										'const ExtractTextPlugin = require(\'extract-text-webpack-plugin\');',
										'\n'
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
								done();
							});
						});
					});
				});
			});
		});
	}
	installPlugins() {
		let asyncNamePrompt = this.async();
		this.prompt([
			Input('nameType', 'Name your \'webpack.[name].js?\' [default: \'config\']:')
		]).then( (nameAnswer) => {
			if(nameAnswer['nameType'].length) {
				this.configuration.config.configName = nameAnswer['nameType'];
			}
		}).then( () => {
			asyncNamePrompt();
			this.npmInstall(this.npmInstalls, { 'save-dev': true });
		});
	}

};
