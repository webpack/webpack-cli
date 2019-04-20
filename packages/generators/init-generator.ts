import chalk from "chalk";
import * as logSymbols from "log-symbols";
import Generator = require("yeoman-generator");

import { getPackageManager } from "@webpack-cli/utils/package-manager";
import {
	Confirm,
	Input,
	List,
} from "@webpack-cli/webpack-scaffold";

import { IWebpackOptions } from "./types";
import checkDefault from "./utils/checkDefaults";
import entryQuestions from "./utils/entry";
import getBabelPlugin from "./utils/module";
import getDefaultPlugins from "./utils/plugins";
import tooltip from "./utils/tooltip";

/**
 *
 * Generator for initializing a webpack config
 *
 * @class 	InitGenerator
 * @extends Generator
 * @returns {Void} After execution, transforms are triggered
 *
 */
export default class InitGenerator extends Generator {
	public usingDefaults: boolean;
	private isProd: boolean;
	private dependencies: string[];
	private configuration: {
		config: {
			configName?: string,
			topScope?: string[],
			webpackOptions?: IWebpackOptions,
		},
	};

	constructor(args, opts) {
		super(args, opts);
		this.isProd = false;
		this.usingDefaults = false,
		this.dependencies = [
			"webpack",
			"webpack-cli",
			"terser-webpack-plugin",
			"babel-plugin-syntax-dynamic-import",
		];
		this.configuration = {
			config: {
				topScope: [],
				webpackOptions: {},
			},
		};
	}

	public prompting() {
		const done: (_?: void) => void | boolean = this.async();
		const self: this = this;
		let regExpForStyles: string;
		let ExtractUseProps: object[];

		process.stdout.write(
			"\n" +
				logSymbols.info +
				chalk.blue(" INFO ") +
				"For more information and a detailed description of each question, have a look at " +
				chalk.bold.green(
					"https://github.com/webpack/webpack-cli/blob/master/INIT.md",
				) +
				"\n",
		);
		process.stdout.write(
			logSymbols.info +
				chalk.blue(" INFO ") +
				"Alternatively, run `webpack(-cli) --help` for usage info." +
				"\n\n",
		);

		this.configuration.config.webpackOptions.module = {
			rules: [],
		};
		this.configuration.config.topScope.push(
			"const webpack = require('webpack')",
			"const path = require('path')",
			"\n",
		);

		const initConfig = [];

		return this.prompt([
			Confirm("entryType", "Will your application have multiple bundles?", false),
		])
			.then((entryTypeAnswer: {
				entryType: boolean;
			}) => {
				initConfig.push(entryTypeAnswer);
				// Ask different questions for entry points
				return entryQuestions(self, entryTypeAnswer);
			})
			.then((entryOptions: object | string) => {
				initConfig.push({entryOption: entryOptions});
				if (typeof entryOptions === "string" && entryOptions.length > 0) {
					return this.prompt([
						Input(
							"outputType",
							"In which folder do you want to store your generated bundles? (dist):",
						),
					]);
				}
				if (entryOptions !== "\"\"") {
					this.configuration.config.webpackOptions.entry = entryOptions;
				}
				return this.prompt([
					Input(
						"outputType",
						"In which folder do you want to store your generated bundles? (dist):",
					),
				]);
			})
			.then((outputTypeAnswer: {
				outputType: string;
			}) => {
				initConfig.push(outputTypeAnswer);

				// As entry is not required anymore and we dont set it to be an empty string or """""
				// it can be undefined so falsy check is enough (vs entry.length);
				if (
					!this.configuration.config.webpackOptions.entry &&
					!this.usingDefaults
				) {
					this.configuration.config.webpackOptions.output = {
						chunkFilename: "'[name].[chunkhash].js'",
						filename: "'[name].[chunkhash].js'",
					};
				} else if (!this.usingDefaults) {
					this.configuration.config.webpackOptions.output = {
						filename: "'[name].[chunkhash].js'",
					};
				}
				if (!this.usingDefaults && outputTypeAnswer.outputType.length) {
					this.configuration.config.webpackOptions.output.path =
						`path.resolve(__dirname, '${outputTypeAnswer.outputType}')`;
				}
			})
			.then((_: void) => {
				this.isProd = this.usingDefaults ? true : false;
				this.configuration.config.configName = this.isProd ? "prod" : "config";
				if (!this.isProd) {
					this.configuration.config.webpackOptions.mode = "'development'";
				}
				this.configuration.config.webpackOptions.plugins = this.isProd ? [] : getDefaultPlugins();
				return this.prompt([
					Confirm("babelConfirm", "Will you be using ES2015?"),
				]);
			})
			.then((babelConfirmAnswer: {
				babelConfirm: boolean;
			}) => {
				initConfig.push(babelConfirmAnswer);
				if (babelConfirmAnswer.babelConfirm) {
					this.configuration.config.webpackOptions.module.rules.push(
						getBabelPlugin(),
					);
					this.dependencies.push(
						"babel-loader",
						"@babel/core",
						"@babel/preset-env",
					);
				}
			})
			.then((_: void) => {
				return this.prompt([
					List("stylingType", "Will you use one of the below CSS solutions?", [
						"No",
						"CSS",
						"SASS",
						"LESS",
						"PostCSS",
					]),
				]);
			})
			.then((stylingTypeAnswer: {
				stylingType: string;
			}) => {
				initConfig.push(stylingTypeAnswer);
				ExtractUseProps = [];
				switch (stylingTypeAnswer.stylingType) {
					case "SASS":
						this.dependencies.push(
							"sass-loader",
							"node-sass",
							"style-loader",
							"css-loader",
						);
						regExpForStyles = `${new RegExp(/\.(scss|css)$/)}`;
						if (this.isProd) {
							ExtractUseProps.push(
								{
									loader: "'css-loader'",
									options: {
										sourceMap: true,
									},
								},
								{
									loader: "'sass-loader'",
									options: {
										sourceMap: true,
									},
								},
							);
						} else {
							ExtractUseProps.push(
								{
									loader: "'style-loader'",
								},
								{
									loader: "'css-loader'",
								},
								{
									loader: "'sass-loader'",
								},
							);
						}
						break;
					case "LESS":
						regExpForStyles = `${new RegExp(/\.(less|css)$/)}`;
						this.dependencies.push(
							"less-loader",
							"less",
							"style-loader",
							"css-loader",
						);
						if (this.isProd) {
							ExtractUseProps.push(
								{
									loader: "'css-loader'",
									options: {
										sourceMap: true,
									},
								},
								{
									loader: "'less-loader'",
									options: {
										sourceMap: true,
									},
								},
							);
						} else {
							ExtractUseProps.push(
								{
									loader: "'css-loader'",
									options: {
										sourceMap: true,
									},
								},
								{
									loader: "'less-loader'",
									options: {
										sourceMap: true,
									},
								},
							);
						}
						break;
					case "PostCSS":
						this.configuration.config.topScope.push(
							tooltip.postcss(),
							"const autoprefixer = require('autoprefixer');",
							"const precss = require('precss');",
							"\n",
						);
						this.dependencies.push(
							"style-loader",
							"css-loader",
							"postcss-loader",
							"precss",
							"autoprefixer",
						);
						regExpForStyles = `${new RegExp(/\.css$/)}`;
						if (this.isProd) {
							ExtractUseProps.push(
								{
									loader: "'css-loader'",
									options: {
										importLoaders: 1,
										sourceMap: true,
									},
								},
								{
									loader: "'postcss-loader'",
									options: {
										plugins: `function () {
											return [
												precss,
												autoprefixer
											];
										}`,
									},
								},
							);
						} else {
							ExtractUseProps.push(
								{
									loader: "'style-loader'",
								},
								{
									loader: "'css-loader'",
									options: {
										importLoaders: 1,
										sourceMap: true,
									},
								},
								{
									loader: "'postcss-loader'",
									options: {
										plugins: `function () {
											return [
												precss,
												autoprefixer
											];
										}`,
									},
								},
							);
						}
						break;
					case "CSS":
						this.dependencies.push("style-loader", "css-loader");
						regExpForStyles = `${new RegExp(/\.css$/)}`;
						if (this.isProd) {
							ExtractUseProps.push({
								loader: "'css-loader'",
								options: {
									sourceMap: true,
								},
							});
						} else {
							ExtractUseProps.push(
								{
									loader: "'style-loader'",
									options: {
										sourceMap: true,
									},
								},
								{
									loader: "'css-loader'",
								},
							);
						}
						break;
					default:
						regExpForStyles = null;
				}
			})
			.then((_: void) => {
				if (this.isProd) {
					// Ask if the user wants to use extractPlugin
					return this.prompt([
						Input(
							"extractPlugin",
							"If you want to bundle your CSS files, what will you name the bundle? (press enter to skip)",
						),
					]);
				}
			})
			.then((extractPluginAnswer: {
				extractPlugin: string;
			}) => {
				if (regExpForStyles) {
					if (this.isProd) {
						const cssBundleName: string = extractPluginAnswer.extractPlugin;
						this.configuration.config.topScope.push(tooltip.cssPlugin());
						this.dependencies.push("mini-css-extract-plugin");

						if (cssBundleName.length !== 0) {
							this.configuration.config.webpackOptions.plugins.push(
								// TODO: use [contenthash] after it is supported
								`new MiniCssExtractPlugin({ filename:'${cssBundleName}.[chunkhash].css' })`,
							);
						} else {
							this.configuration.config.webpackOptions.plugins.push(
								"new MiniCssExtractPlugin({ filename:'style.css' })",
							);
						}

						ExtractUseProps.unshift({
							loader: "MiniCssExtractPlugin.loader",
						});

						const moduleRulesObj = {
							test: regExpForStyles,
							use: ExtractUseProps,
						};

						this.configuration.config.webpackOptions.module.rules.push(
							moduleRulesObj,
						);
						this.configuration.config.topScope.push(
							"const MiniCssExtractPlugin = require('mini-css-extract-plugin');",
							"\n",
						);
					} else {
						const moduleRulesObj: {
							test: string;
							use: object[];
						} = {
							test: regExpForStyles,
							use: ExtractUseProps,
						};

						this.configuration.config.webpackOptions.module.rules.push(
							moduleRulesObj,
						);
					}
				}
				// Check if the options selected by the user are defaults
				if (checkDefault(initConfig)) {
					this.installPlugins();
					return process.stdout.write(`You're using a default config`);
				}
				// add splitChunks options for transparency
				// defaults coming from: https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks
				this.configuration.config.topScope.push(tooltip.splitChunks());
				this.configuration.config.webpackOptions.optimization = {
					splitChunks: {
						cacheGroups: {
							vendors: {
								priority: -10,
								test: "/[\\\\/]node_modules[\\\\/]/",
							},
						},
						chunks: "'async'",
						minChunks: 1,
						minSize: 30000,
						// for production name is recommended to be off
						name: !this.isProd,
					},
				};

				done();
			});
	}
	public installPlugins() {
		if (this.isProd) {
			this.dependencies = this.dependencies.filter(
				(p: string): boolean => p !== "terser-webpack-plugin",
			);
		} else {
			this.configuration.config.topScope.push(
				tooltip.terser(),
				"const TerserPlugin = require('terser-webpack-plugin');",
				"\n",
			);
		}
		const packager = getPackageManager();
		const opts: {
			dev?: boolean,
			"save-dev"?: boolean,
		} = packager === "yarn" ? { dev: true } : { "save-dev": true };
		this.scheduleInstallTask(packager, this.dependencies, opts);
	}

	public writing() {
		this.config.set("configuration", this.configuration);
	}
}
