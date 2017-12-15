const Generator = require("yeoman-generator");
const glob = require("glob-all");
const List = require("webpack-addons").List;
const Input = require("webpack-addons").Input;

const webpackSchema = require("webpack/schemas/WebpackOptions");
const webpackDevServerSchema = require("webpack-dev-server/lib/optionsSchema.json");
const PROP_TYPES = require("../utils/prop-types");

const getPackageManager = require("../utils/package-manager").getPackageManager;
const npmExists = require("../utils/npm-exists");

// https://gist.github.com/efenacigiray/9367920
function replaceAt(string, index, replace) {
	return string.substring(0, index) + replace + string.substring(index + 1);
}

module.exports = class AddGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.dependencies = [];
		this.configuration = {
			config: {
				webpackOptions: {},
				topScope: ["const webpack = require('webpack')"]
			}
		};
	}

	prompting() {
		let done = this.async();
		let action;
		let manualOrListInput = action =>
			Input("actionAnswer", `what do you want to add to ${action}?`);
		// first index indicates if it has a deep prop, 2nd indicates what kind of
		let isDeepProp = [false, false];

		this.prompt([
			List(
				"actionType",
				"What property do you want to add to?",
				Array.from(PROP_TYPES.keys())
			)
		])
			.then(actionTypeAnswer => {
				this.configuration.config.webpackOptions[
					actionTypeAnswer.actionType
				] = null;

				action = actionTypeAnswer.actionType;
			})
			.then(() => {
				const webpackSchemaProp = webpackSchema.definitions[action];
				/*
				 * https://github.com/webpack/webpack/blob/next/schemas/WebpackOptions.json
				 * Find the properties directly in the properties prop, or the anyOf prop
				 */
				let defOrPropDescription = webpackSchemaProp
					? webpackSchemaProp.properties
					: webpackSchema.properties[action].properties
						? webpackSchema.properties[action].properties
						: webpackSchema.properties[action].anyOf
							? webpackSchema.properties[action].anyOf.filter(
								p => p.properties || p.enum
							)
							: null;
				if (Array.isArray(defOrPropDescription)) {
					// Todo: Generalize these to go through the array, then merge enum with props if needed
					if (
						defOrPropDescription[0].hasOwnProperty("properties") ||
						defOrPropDescription[1].hasOwnProperty("properties")
					) {
						defOrPropDescription = defOrPropDescription[0].hasOwnProperty(
							"properties"
						)
							? defOrPropDescription[0].properties
							: defOrPropDescription[1].properties;
					} else if (
						defOrPropDescription[0].hasOwnProperty("enum") ||
						defOrPropDescription[1].hasOwnProperty("enum")
					) {
						const originalPropDesc = defOrPropDescription[0].enum;
						// Array -> Object -> Merge objects into one for compat in manualOrListInput
						defOrPropDescription = Object.keys(defOrPropDescription[0].enum)
							.map(p => {
								return Object.assign(
									{},
									{
										[originalPropDesc[p]]: "noop"
									}
								);
							})
							.reduce((result, currentObject) => {
								for (let key in currentObject) {
									if (currentObject.hasOwnProperty(key)) {
										result[key] = currentObject[key];
									}
								}
								return result;
							}, {});
					}
				}
				const webpackDevserverSchemaProp =
					action === "devServer" ? webpackDevServerSchema : null;
				// If we've got a schema prop or devServer Schema Prop
				if (defOrPropDescription || webpackDevserverSchemaProp) {
					// Check for properties in definitions[action] or properties[action]
					if (defOrPropDescription) {
						manualOrListInput = List(
							"actionAnswer",
							`what do you want to add to ${action}?`,
							Object.keys(defOrPropDescription)
						);
						isDeepProp[0] = true;
					} else if (webpackDevserverSchemaProp) {
						manualOrListInput = List(
							"actionAnswer",
							`what do you want to add to ${action}?`,
							Object.keys(webpackDevserverSchemaProp.properties)
						);
						isDeepProp[0] = true;
					} else {
						// manual input if non-existent
						manualOrListInput = manualOrListInput(action);
					}
				} else {
					manualOrListInput = manualOrListInput(action);
				}
				return this.prompt([manualOrListInput]);
			})
			.then(answerToAction => {
				if (action === "plugins" || action === "loader") {
					const pluginExist = glob
						.sync([
							"node_modules/webpack/lib/*Plugin.js",
							"node_modules/webpack/lib/**/*Plugin.js"
						])
						.map(p =>
							p
								.split("/")
								.pop()
								.replace(".js", "")
						)
						.find(
							p => p.toLowerCase().indexOf(answerToAction.actionAnswer) >= 0
						);
					if (pluginExist) {
						this.configuration.config.item = pluginExist;
						this.configuration.config.webpackOptions[
							action
						] = `new webpack.${pluginExist}`;
						done();
					} else {
						npmExists(answerToAction.actionAnswer).then(p => {
							if (p) {
								this.dependencies.push(answerToAction.actionAnswer);
								const normalizePluginName = answerToAction.actionAnswer.replace(
									"-webpack-plugin",
									"Plugin"
								);
								const pluginName = replaceAt(
									normalizePluginName,
									0,
									normalizePluginName.charAt(0).toUpperCase()
								);
								this.configuration.config.topScope.push(
									`const ${pluginName} = require("${
										answerToAction.actionAnswer
									}")`
								);
								this.configuration.config.webpackOptions[
									action
								] = `new ${pluginName}`;
								this.configuration.config.item = answerToAction.actionAnswer;
								done();

								this.runInstall(getPackageManager(), this.dependencies, {
									"save-dev": true
								});
							} else {
								console.error(
									answerToAction.actionAnswer,
									"doesn't exist on NPM or is built in webpack, please check for any misspellings."
								);
								process.exit(0);
							}
						});
					}
				} else {
					if (isDeepProp[0]) {
						isDeepProp[1] = answerToAction.actionAnswer;
						this.prompt([
							Input(
								"deepProp",
								`what do you want the value of ${isDeepProp[1]} to be?`
							)
						]).then(deepPropAns => {
							this.configuration.config.item = action + "." + isDeepProp[1];
							this.configuration.config.webpackOptions[action] = {
								[isDeepProp[1]]: `'${deepPropAns.deepProp}'`
							};
							done();
						});
					} else {
						this.configuration.config.item = action;
						this.configuration.config.webpackOptions[action] =
							answerToAction.actionAnswer;
						done();
					}
				}
			});
	}
};
