"use strict";

const Generator = require("yeoman-generator");
const chalk = require("chalk");
const logSymbols = require("log-symbols");

const createCommonsChunkPlugin = require("webpack-addons")
	.createCommonsChunkPlugin;

const Input = require("webpack-addons").Input;
const Confirm = require("webpack-addons").Confirm;
const List = require("webpack-addons").List;

const getPackageManager = require("../utils/package-manager").getPackageManager;

const entryQuestions = require("./utils/entry");
const getBabelPlugin = require("./utils/module");
const getDefaultPlugins = require("./utils/plugins");
const tooltip = require("./utils/tooltip");

/**
 *
 * Generator for initializing a webpack config
 *
 * @class 	InitGenerator
 * @extends Generator
 * @returns {Void} After execution, transforms are triggered
 *
 */
module.exports = class InitGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.isProd = false;
		this.dependencies = [
			"webpack",
			"webpack-cli",
			"uglifyjs-webpack-plugin"
		];
		this.configuration = {
			config: {
				webpackOptions: {},
				topScope: []
			}
		};
	}

	prompting() {
		const done = this.async();
		const self = this;
		let oneOrMoreEntries;
		let regExpForStyles;
		let ExtractUseProps;
		let outputPath = "dist";
		process.stdout.write(
			"\n" +
				logSymbols.info +
				chalk.blue(" INFO ") +
				"For more information and a detailed description of each question, have a look at " +
				chalk.bold.green(
					"https://github.com/webpack/webpack-cli/blob/master/INIT.md"
				) +
				"\n"
		);
		process.stdout.write(
			logSymbols.info +
				chalk.blue(" INFO ") +
				"Alternatively, run `webpack(-cli) --help` for usage info." +
				"\n\n"
		);
		this.configuration.config.webpackOptions.module = {
			rules: []
		};
		this.configuration.config.webpackOptions.plugins = getDefaultPlugins();
		this.configuration.config.topScope.push(
			"const webpack = require('webpack')",
			"const path = require('path')",
			tooltip.uglify(),
			"const UglifyJSPlugin = require('uglifyjs-webpack-plugin');",
			"\n"
		);

		this.prompt([
			Confirm("entryType", "Will your application have multiple bundles?")
		])
			.then(entryTypeAnswer => {
				// Ask different questions for entry points
				return entryQuestions(self, entryTypeAnswer);
			})
			.then(entryOptions => {
				this.configuration.config.webpackOptions.entry = entryOptions;
				oneOrMoreEntries = Object.keys(entryOptions);

				return this.prompt([
					Input(
						"outputType",
						"Which folder will your generated bundles be in? [default: dist]:"
					)
				]);
			})
			.then(outputTypeAnswer => {
				if (!this.configuration.config.webpackOptions.entry.length) {
					this.configuration.config.topScope.push(tooltip.commonsChunk());
					this.configuration.config.webpackOptions.output = {
						filename: "'[name].[chunkhash].js'",
						chunkFilename: "'[name].[chunkhash].js'"
					};
				} else {
					this.configuration.config.webpackOptions.output = {
						filename: "'[name].bundle.js'"
					};
				}
				if (outputTypeAnswer["outputType"].length) {
					outputPath = outputTypeAnswer["outputType"];
				}
				this.configuration.config.webpackOptions.output.path = `path.resolve(__dirname, '${outputPath}')`;
			})
			.then(() => {
				return this.prompt([
					Confirm("prodConfirm", "Are you going to use this in production?")
				]);
			})
			.then(prodConfirmAnswer => this.isProd = prodConfirmAnswer["prodConfirm"])
			.then(() => {
				return this.prompt([
					Confirm("babelConfirm", "Will you be using ES2015?")
				]);
			})
			.then(babelConfirmAnswer => {
				if (babelConfirmAnswer["babelConfirm"] === true) {
					this.configuration.config.webpackOptions.module.rules.push(
						getBabelPlugin()
					);
					this.dependencies.push(
						"babel-core",
						"babel-loader",
						"babel-preset-env"
					);
				}
			})
			.then(() => {
				return this.prompt([
					List("stylingType", "Will you use one of the below CSS solutions?", [
						"SASS",
						"LESS",
						"CSS",
						"PostCSS",
						"No"
					])
				]);
			})
			.then(stylingTypeAnswer => {
				if (!this.isProd) {
					ExtractUseProps = [];
				}
				switch (stylingTypeAnswer["stylingType"]) {
					case "SASS":
						this.dependencies.push(
							"sass-loader",
							"node-sass",
							"style-loader",
							"css-loader"
						);
						regExpForStyles = `${new RegExp(/\.(scss|css)$/)}`;
						if (this.isProd) {
							ExtractUseProps = `
								use: [{
									loader: "css-loader",
									options: {
										sourceMap: true
									}
								}, {
									loader: "sass-loader",
									options: {
										sourceMap: true
									}
								}],
								fallback: "style-loader"
							`;
						} else {
							ExtractUseProps.push(
								{
									loader: "'style-loader'"
								},
								{
									loader: "'css-loader'"
								},
								{
									loader: "'sass-loader'"
								}
							);
						}
						break;
					case "LESS":
						regExpForStyles = `${new RegExp(/\.(less|css)$/)}`;
						this.dependencies.push(
							"less-loader",
							"less",
							"style-loader",
							"css-loader"
						);
						if (this.isProd) {
							ExtractUseProps = `
								use: [{
									loader: "css-loader",
									options: {
										sourceMap: true
									}
								}, {
									loader: "less-loader",
									options: {
										sourceMap: true
									}
								}],
								fallback: "style-loader"
							`;
						} else {
							ExtractUseProps.push(
								{
									loader: "'css-loader'",
									options: {
										sourceMap: true
									}
								},
								{
									loader: "'less-loader'",
									options: {
										sourceMap: true
									}
								}
							);
						}
						break;
					case "PostCSS":
						this.configuration.config.topScope.push(
							tooltip.postcss(),
							"const autoprefixer = require('autoprefixer');",
							"const precss = require('precss');",
							"\n"
						);
						this.dependencies.push(
							"style-loader",
							"css-loader",
							"postcss-loader",
							"precss",
							"autoprefixer"
						);
						regExpForStyles = `${new RegExp(/\.css$/)}`;
						if (this.isProd) {
							ExtractUseProps = `
								use: [{
									loader: "style-loader"
								},{
									loader: "css-loader",
									options: {
										sourceMap: true,
										importLoaders: 1
									}
								}, {
									loader: "postcss-loader",
									options: {
										plugins: function () {
											return [
												precss,
												autoprefixer
											];
										}
									}
								}],
								fallback: "style-loader"
							`;
						} else {
							ExtractUseProps.push(
								{
									loader: "'style-loader'"
								},
								{
									loader: "'css-loader'",
									options: {
										sourceMap: true,
										importLoaders: 1
									}
								},
								{
									loader: "'postcss-loader'",
									options: {
										plugins: `function () {
											return [
												precss,
												autoprefixer
											];
										}`
									}
								}
							);
						}
						break;
					case "CSS":
						this.dependencies.push("style-loader", "css-loader");
						regExpForStyles = `${new RegExp(/\.css$/)}`;
						if (this.isProd) {
							ExtractUseProps = `
								use: [{
									loader: "css-loader",
									options: {
										sourceMap: true
									}
								}],
								fallback: "style-loader"
							`;
						} else {
							ExtractUseProps.push(
								{
									loader: "'style-loader'",
									options: {
										sourceMap: true
									}
								},
								{
									loader: "'css-loader'"
								}
							);
						}
						break;
					default:
						regExpForStyles = null;
				}
			})
			.then(() => {
				// Ask if the user wants to use extractPlugin
				return this.prompt([
					Input(
						"extractPlugin",
						"If you want to bundle your CSS files, what will you name the bundle? (press enter to skip)"
					)
				]);
			})
			.then(extractPluginAnswer => {
				const cssBundleName = extractPluginAnswer["extractPlugin"];
				if (regExpForStyles) {
					if (this.isProd) {
						this.configuration.config.topScope.push(tooltip.cssPlugin());
						// TODO: Replace with regular version once v.4 is out
						this.dependencies.push("extract-text-webpack-plugin@next");

						if (cssBundleName.length !== 0) {
							this.configuration.config.webpackOptions.plugins.push(
								`new ExtractTextPlugin('${cssBundleName}.[contentHash].css')`
							);
						} else {
							this.configuration.config.webpackOptions.plugins.push(
								"new ExtractTextPlugin('style.css')"
							);
						}

						const moduleRulesObj = {
							test: regExpForStyles,
							use: `ExtractTextPlugin.extract({ ${ExtractUseProps} })`
						};

						this.configuration.config.webpackOptions.module.rules.push(
							moduleRulesObj
						);
						this.configuration.config.topScope.push(
							"const ExtractTextPlugin = require('extract-text-webpack-plugin');",
							"\n"
						);
					} else {
						const moduleRulesObj = {
							test: regExpForStyles,
							use: ExtractUseProps
						};

						this.configuration.config.webpackOptions.module.rules.push(
							moduleRulesObj
						);
					}
				}
			})
			.then(() => {
				if (this.configuration.config.webpackOptions.entry.length === 0) {
					oneOrMoreEntries.forEach(prop => {
						this.configuration.config.webpackOptions.plugins.push(
							createCommonsChunkPlugin(prop)
						);
					});
				}
				done();
			});
	}

	installPlugins() {
		const asyncNamePrompt = this.async();
		const defaultName = this.isProd ? "prod" : "config";
		this.prompt([
			Input(
				"nameType",
				`Name your 'webpack.[name].js?' [default: '${defaultName}']:`
			)
		])
			.then(nameTypeAnswer => {
				this.configuration.config.configName = nameTypeAnswer["nameType"].length ?
					nameTypeAnswer["nameType"] : defaultName;
			})
			.then(() => {
				asyncNamePrompt();
				this.runInstall(getPackageManager(), this.dependencies, {
					"save-dev": true
				});
			});
	}

	writing() {
		this.config.set("configuration", this.configuration);
	}
};
