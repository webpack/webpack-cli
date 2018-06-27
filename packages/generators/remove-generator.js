const Generator = require("yeoman-generator");
const path = require("path");
const fs = require("fs");
const { List } = require("@webpack-cli/webpack-scaffold");

const PROP_TYPES = require("@webpack-cli/utils/prop-types");

/**
 *
 * Generator for removing properties
 * @class	RemoveGenerator
 * @extends	Generator
 * @returns	{Void} After execution, transforms are triggered
 *
 */

module.exports = class RemoveGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.configuration = {
			config: {
				webpackOptions: {},
			}
		};

		let configPath = path.resolve(process.cwd(), "webpack.config.js");
		const webpackConfigExists = fs.existsSync(configPath);
		if (!webpackConfigExists) {
			configPath = null;
			// end the generator stating webpack config not found or to specify the config
		}
		this.webpackOptions = require(configPath);
	}

	getPropTypes() {
		return Object.keys(this.webpackOptions);
	}

	getModuleLoaders() {
		if (this.webpackOptions.module && this.webpackOptions.module.rules) {
			return this.webpackOptions.module.rules.map(rule => rule ? rule.loader : null);
		}
	}

	prompting() {
		const done = this.async();
		let propValue;

		return this.prompt([
			List(
				"propType",
				"Which property do you want to remove?",
				Array.from(this.getPropTypes())
			)
		])
			.then(({ propType }) => {
				if (!PROP_TYPES.has(propType)) {
					console.log("Invalid webpack config prop");
					return;
				}

				propValue = this.webpackOptions[propType];
				if (typeof propValue === "object") {
					if (Array.isArray(propValue)) {
						return this.prompt([
							List(
								"keyType",
								`Which key do you want to remove from ${propType}?`,
								Array.from(propValue)
							)
						]).then(({ keyType }) => {
							this.configuration.config.webpackOptions[propType] = [ keyType ];
						});
					} else {
						return this.prompt([
							List(
								"keyType",
								`Which key do you want to remove from ${propType}?`,
								Array.from(Object.keys(propValue))
							)
						])
							.then(({ keyType }) => {
								if (propType === "module" && keyType === "rules") {
									return this.prompt([
										List(
											"rule",
											"Which loader do you want to remove?",
											Array.from(this.getModuleLoaders())
										)
									])
										.then(({ rule }) => {
											const loaderIndex = this.getModuleLoaders().indexOf(rule);
											const loader = this.webpackOptions.module.rules[loaderIndex];
											this.configuration.config.webpackOptions.module = {
												rules: [ loader ]
											};
										});
								} else {
									// remove the complete prop object if there is only one key
									if (Object.keys(this.webpackOptions[propType]).length <= 1) {
										this.configuration.config.webpackOptions[propType] = null;
									} else {
										this.configuration.config.webpackOptions[propType] = {
											[keyType]: null
										};
									}
								}
							});
					}
				} else {
					this.configuration.config.webpackOptions[propType] = null;
				}
			})
			.then(() => {
				done();
			});
	}

	writing() {
		this.config.set("configuration", this.configuration);
	}
};
