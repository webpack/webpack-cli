/* eslint-disable node/no-unpublished-require */
/**
 * Endpoint for @webpack-cli/init
 */
const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {

	// Configuration Manager
	const Config = require("../../../init/config").Config;

	// Scaffolder
	const scaffoldProject = require("../../../init").scaffoldProject;

	// Questioner
	const Questioner = require("../../utils/questioner").default;

	// Utilities
	const entryQuestions = require("./_entry");
	const getBabelPlugin = require("./_module");
	const getDefaultPlugins = require("./_plugins");
	const tooltip = require("./_tooltip");

	// Question types used
	const Confirm = require("../../../webpack-scaffold").Confirm;
	const Input = require("../../../webpack-scaffold").Input;
	const List = require("../../../webpack-scaffold").List;

	let config = new Config();
	let questioner = new Questioner();

	config.setConfigPath(process.env.CWD);

	let dependencies = [
		"webpack",
		"webpack-cli",
		"uglifyjs-webpack-plugin",
		"babel-plugin-syntax-dynamic-import",
	];

	config.pushToTopScope(
		"const webpack = require('webpack')",
		"const path = require('path')",
		"\n"
	);

	config.setWebpackOption("module",{
		rules: []
	});

	let usingDefaults = false;
	let isProd = false;
	let ExtractUseProps = [];
	let regExpForStyles;

	questioner.start({
		action: "question",
		question: Confirm("entryType", "Will your application have multiple bundles?"),
	}).then((entryTypeAnswer) => {
		return entryQuestions(questioner, entryTypeAnswer);
	}).then((entryOptions) => {
		if (entryOptions !== "\"\"") {
			config.setWebpackOption("entry", entryOptions);
		} else {
			usingDefaults = true;
		}
		return questioner.question({
			action: "question",
			question: Input(
				"outputType",
				"Which folder will your generated bundles be in? [default: dist]:"
			),
		});
	}).then((outputTypeAnswer) => {
		if (
			!config.webpackOptions.entry &&
			!usingDefaults
		) {
			config.webpackOptions.output = {
				chunkFilename: "'[name].[chunkhash].js'",
				filename: "'[name].[chunkhash].js'",
			};
		} else if (!usingDefaults) {
			config.webpackOptions.output = {
				filename: "'[name].[chunkhash].js'",
			};
		}

		let outputPath = "dist";
		if (outputTypeAnswer.outputType.length) {
			outputPath = outputTypeAnswer.outputType;
		}
		if (!usingDefaults) {
			config.webpackOptions.output.path = `path.resolve(__dirname, '${outputPath}')`;
		}
	}).then((_) => {
		isProd = usingDefaults ? true : false;
		config.setConfigName(isProd ? "prod" : "dev");
		config.webpackOptions.mode = isProd
			? "'production'"
			: "'development'";
		config.webpackOptions.plugins = isProd ? [] : getDefaultPlugins();

		return questioner.question([
			{
				action: "question",
				question: Confirm("babelConfirm", "Will you be using ES2015?"),
			}
		]);
	}).then((babelConfirmAnswer) => {
		if (babelConfirmAnswer.babelConfirm === true) {
			config.webpackOptions.module.rules.push(
				getBabelPlugin()
			);
			dependencies.push(
				"babel-core",
				"babel-loader",
				"babel-preset-env"
			);
		}
	}).then((_) => {
		return questioner.question([
			{
				action: "question",
				question: List("stylingType", "Will you use one of the below CSS solutions?", [
					"SASS",
					"LESS",
					"CSS",
					"PostCSS",
					"No",
				]),
			}
		]);
	}).then((stylingTypeAnswer) => {
		switch (stylingTypeAnswer.stylingType) {
			case "SASS":
				dependencies.push(
					"sass-loader",
					"node-sass",
					"style-loader",
					"css-loader"
				);
				regExpForStyles = `${new RegExp(/\.(scss|css)$/)}`;
				if (isProd) {
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
						}
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
						}
					);
				}
				break;
			case "LESS":
				regExpForStyles = `${new RegExp(/\.(less|css)$/)}`;
				dependencies.push(
					"less-loader",
					"less",
					"style-loader",
					"css-loader"
				);
				if (isProd) {
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
						}
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
						}
					);
				}
				break;
			case "PostCSS":
				config.pushToTopScope(
					tooltip.postcss(),
					"const autoprefixer = require('autoprefixer');",
					"const precss = require('precss');",
					"\n"
				);
				dependencies.push(
					"style-loader",
					"css-loader",
					"postcss-loader",
					"precss",
					"autoprefixer"
				);
				regExpForStyles = `${new RegExp(/\.css$/)}`;
				if (isProd) {
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
						}
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
						}
					);
				}
				break;
			case "CSS":
				dependencies.push("style-loader", "css-loader");
				regExpForStyles = `${new RegExp(/\.css$/)}`;
				if (isProd) {
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
						}
					);
				}
				break;
			default:
				regExpForStyles = null;
		}
	}).then((_) => {
		if (isProd) {
			// Ask if the user wants to use extractPlugin
			return questioner.question([
				{
					action: "question",
					question: Input(
						"extractPlugin",
						"If you want to bundle your CSS files, what will you name the bundle?"
					),
				}
			]);
		}
	}).then((extractPluginAnswer) => {
		if (regExpForStyles) {
			if (this.isProd) {
				const cssBundleName = extractPluginAnswer.extractPlugin;
				config.pushToTopScope(tooltip.cssPlugin());
				dependencies.push("mini-css-extract-plugin");

				if (cssBundleName.length !== 0) {
					config.webpackOptions.plugins.push(
						// TODO: use [contenthash] after it is supported
						`new MiniCssExtractPlugin({ filename:'${cssBundleName}.[chunkhash].css' })`
					);
				} else {
					config.webpackOptions.plugins.push(
						"new MiniCssExtractPlugin({ filename:'style.css' })"
					);
				}

				ExtractUseProps.unshift({
					loader: "MiniCssExtractPlugin.loader",
				});

				const moduleRulesObj = {
					test: regExpForStyles,
					use: ExtractUseProps,
				};

				config.webpackOptions.module.rules.push(
					moduleRulesObj
				);
				config.pushToTopScope(
					"const MiniCssExtractPlugin = require('mini-css-extract-plugin');",
					"\n"
				);
			} else {
				const moduleRulesObj = {
					test: regExpForStyles,
					use: ExtractUseProps,
				};

				config.webpackOptions.module.rules.push(
					moduleRulesObj
				);
			}
		}
		// add splitChunks options for transparency
		// defaults coming from: https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks
		config.pushToTopScope(tooltip.splitChunks());
		config.webpackOptions.optimization = {
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
				name: !isProd,
			},
		};
	}).then((_) => {
		// installPlugins()
		if (isProd) {
			dependencies = dependencies.filter(
				(p) => p !== "uglifyjs-webpack-plugin"
			);
		} else {
			config.pushToTopScope(
				tooltip.uglify(),
				"const UglifyJSPlugin = require('uglifyjs-webpack-plugin');",
				"\n"
			);
		}
		scaffoldProject(dependencies,config.exportConfig());
		return questioner.question({ action: "exit" });
	});

	res.json({
		port: questioner.port,
		address: questioner.address
	});
});

module.exports = router;
