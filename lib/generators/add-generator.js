const Generator = require("yeoman-generator");
const glob = require("glob-all");
const path = require("path");
const Confirm = require("webpack-addons").Confirm;
const List = require("webpack-addons").List;
const Input = require("webpack-addons").Input;

const webpackSchema = require("webpack/schemas/WebpackOptions");
const webpackDevServerSchema = require("webpack-dev-server/lib/optionsSchema.json");
const PROP_TYPES = require("../utils/prop-types");

const getPackageManager = require("../utils/package-manager").getPackageManager;
const npmExists = require("../utils/npm-exists");
const entryQuestions = require("./utils/entry");

/**
 *
 * Replaces the string with a substring at the given index
 * https://gist.github.com/efenacigiray/9367920
 *
 * @param {String} string - string to be modified
 * @param {Number} index - index to replace from
 * @param {String} replace - string to replace starting from index
 *
 * @returns {String} string - The newly mutated string
 *
 */
function replaceAt(string, index, replace) {
	return string.substring(0, index) + replace + string.substring(index + 1);
}

/**
 *
 * Checks if the given array has a given property
 *
 * @param {Array} arr - array to check
 * @param {String} prop - property to check existence of
 *
 * @returns {Boolean} hasProp - Boolean indicating if the property
 * is present
 */
const traverseAndGetProperties = (arr, prop) => {
	let hasProp = false;
	arr.forEach(p => {
		if (p[prop]) {
			hasProp = true;
		}
	});
	return hasProp;
};

/**
 *
 * Generator for adding properties
 * @class AddGenerator
 * @extends Generator
 * @returns {Void} After execution, transforms are triggered
 *
 */

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
		let self = this;
		let manualOrListInput = action =>
			Input("actionAnswer", `what do you want to add to ${action}?`);
		// first index indicates if it has a deep prop, 2nd indicates what kind of
		let isDeepProp = [false, false];

		return this.prompt([
			List(
				"actionType",
				"What property do you want to add to?",
				Array.from(PROP_TYPES.keys())
			)
		])
			.then(actionTypeAnswer => {
				// Set initial prop, like devtool
				this.configuration.config.webpackOptions[
					actionTypeAnswer.actionType
				] = null;
				// update the action variable, we're using it later
				action = actionTypeAnswer.actionType;
			})
			.then(() => {
				if (action === "entry") {
					return this.prompt([
						Confirm("entryType", "Will your application have multiple bundles?")
					])
						.then(entryTypeAnswer => {
							// Ask different questions for entry points
							return entryQuestions(self, entryTypeAnswer);
						})
						.then(entryOptions => {
							this.configuration.config.webpackOptions[action] = entryOptions;
							this.configuration.config.item = action;
						});
				}
				let temp = action;
				if (action === "resolveLoader") {
					action = "resolve";
				}
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
					const hasPropertiesProp = traverseAndGetProperties(
						defOrPropDescription,
						"properties"
					);
					const hasEnumProp = traverseAndGetProperties(
						defOrPropDescription,
						"enum"
					);
					/* as we know he schema only has two arrays that might hold our values,
					 * check them for either having arr.enum or arr.properties
					*/
					if (hasPropertiesProp) {
						defOrPropDescription =
							defOrPropDescription[0].properties ||
							defOrPropDescription[1].properties;
						if (!defOrPropDescription) {
							defOrPropDescription = defOrPropDescription[0].enum;
						}
						// TODO: manually implement stats and devtools like sourcemaps
					} else if (hasEnumProp) {
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
				// WDS has its own schema, so we gonna need to check that too
				const webpackDevserverSchemaProp =
					action === "devServer" ? webpackDevServerSchema : null;
				// Watch has a boolean arg, but we need to append to it manually
				if (action === "watch") {
					defOrPropDescription = {
						true: {},
						false: {}
					};
				}
				if (action === "mode") {
					defOrPropDescription = {
						development: {},
						production: {}
					};
				}
				action = temp;
				if (action === "resolveLoader") {
					defOrPropDescription = Object.assign(defOrPropDescription, {
						moduleExtensions: {}
					});
				}
				// If we've got a schema prop or devServer Schema Prop
				if (defOrPropDescription || webpackDevserverSchemaProp) {
					// Check for properties in definitions[action] or properties[action]
					if (defOrPropDescription) {
						if (action !== "devtool") {
							// Add the option of adding an own variable if the user wants
							defOrPropDescription = Object.assign(defOrPropDescription, {
								other: {}
							});
						} else {
							// The schema doesn't have the source maps we can prompt, so add those
							defOrPropDescription = Object.assign(defOrPropDescription, {
								eval: {},
								"cheap-eval-source-map": {},
								"cheap-module-eval-source-map": {},
								"eval-source-map": {},
								"cheap-source-map": {},
								"cheap-module-source-map": {},
								"inline-cheap-source-map": {},
								"inline-cheap-module-source-map": {},
								"source-map": {},
								"inline-source-map": {},
								"hidden-source-map": {},
								"nosources-source-map": {}
							});
						}
						manualOrListInput = List(
							"actionAnswer",
							`what do you want to add to ${action}?`,
							Object.keys(defOrPropDescription)
						);
						// We know we're gonna append some deep prop like module.rule
						isDeepProp[0] = true;
					} else if (webpackDevserverSchemaProp) {
						// Append the custom property option
						webpackDevserverSchemaProp.properties = Object.assign(
							webpackDevserverSchemaProp.properties,
							{
								other: {}
							}
						);
						manualOrListInput = List(
							"actionAnswer",
							`what do you want to add to ${action}?`,
							Object.keys(webpackDevserverSchemaProp.properties)
						);
						// We know we are in a devServer.prop scenario
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
				if (!answerToAction) {
					done();
					return;
				}
				/*
				 * Plugins got their own logic,
				 * find the names of each natively plugin and check if it matches
				*/
				if (action === "plugins") {
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
						const pluginsSchemaPath = glob
							.sync([
								"node_modules/webpack/schemas/plugins/*Plugin.json",
								"node_modules/webpack/schemas/plugins/**/*Plugin.json"
							])
							.find(
								p =>
									p
										.split("/")
										.pop()
										.replace(".json", "")
										.toLowerCase()
										.indexOf(answerToAction.actionAnswer) >= 0
							);
						if (pluginsSchemaPath) {
							const constructorPrefix =
								pluginsSchemaPath.indexOf("optimize") >= 0
									? "webpack.optimize"
									: "webpack";
							const resolvePluginsPath = path.resolve(pluginsSchemaPath);
							const pluginSchema = resolvePluginsPath
								? require(resolvePluginsPath)
								: null;
							let pluginsSchemaProps = ["other"];
							if (pluginSchema) {
								Object.keys(pluginSchema)
									.filter(p => Array.isArray(pluginSchema[p]))
									.forEach(p => {
										Object.keys(pluginSchema[p]).forEach(n => {
											if (pluginSchema[p][n].properties) {
												pluginsSchemaProps = Object.keys(
													pluginSchema[p][n].properties
												);
											}
										});
									});
							}

							return this.prompt([
								List(
									"pluginsPropType",
									`What property do you want to add ${pluginExist}?`,
									pluginsSchemaProps
								)
							]).then(pluginsPropAnswer => {
								return this.prompt([
									Input(
										"pluginsPropTypeVal",
										`What value should ${pluginExist}.${
											pluginsPropAnswer.pluginsPropType
										} have?`
									)
								]).then(valForProp => {
									this.configuration.config.webpackOptions[action] = {
										[`${constructorPrefix}.${pluginExist}`]: {
											[pluginsPropAnswer.pluginsPropType]:
												valForProp.pluginsPropTypeVal
										}
									};
									done();
								});
							});
						} else {
							this.configuration.config.webpackOptions[
								action
							] = `new webpack.${pluginExist}`;
							done();
						}
					} else {
						// If its not in webpack, check npm
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
					// If we're in the scenario with a deep-property
					if (isDeepProp[0]) {
						isDeepProp[1] = answerToAction.actionAnswer;
						if (
							isDeepProp[1] !== "other" &&
							(action === "devtool" || action === "watch" || action === "mode")
						) {
							this.configuration.config.item = action;
							this.configuration.config.webpackOptions[action] =
								answerToAction.actionAnswer;
							done();
							return;
						}
						// Either we are adding directly at the property, else we're in a prop.theOne scenario
						const actionMessage =
							isDeepProp[1] === "other"
								? `what do you want the key on ${action} to be? (press enter if you want it directly as a value on the property)`
								: `what do you want the value of ${isDeepProp[1]} to be?`;

						this.prompt([Input("deepProp", actionMessage)]).then(
							deepPropAns => {
								// The other option needs to be validated of either being empty or not
								if (isDeepProp[1] === "other") {
									let othersDeepPropKey = deepPropAns.deepProp
										? `what do you want the value of ${
											deepPropAns.deepProp
										} to be?`
										: `what do you want to be the value of ${action} to be?`;
									// Push the answer to the array we have created, so we can use it later
									isDeepProp.push(deepPropAns.deepProp);
									this.prompt([Input("deepProp", othersDeepPropKey)]).then(
										deepPropAns => {
											// Check length, if it has none, add the prop directly on the given action
											if (isDeepProp[2].length === 0) {
												this.configuration.config.item = action;
												this.configuration.config.webpackOptions[action] =
													deepPropAns.deepProp;
											} else {
												// If not, we're adding to something like devServer.myProp
												this.configuration.config.item =
													action + "." + isDeepProp[2];
												this.configuration.config.webpackOptions[action] = {
													[isDeepProp[2]]: deepPropAns.deepProp
												};
											}
											done();
										}
									);
								} else {
									// We got the schema prop, we've correctly prompted it, and can add it directly
									this.configuration.config.item = action + "." + isDeepProp[1];
									this.configuration.config.webpackOptions[action] = {
										[isDeepProp[1]]: deepPropAns.deepProp
									};
									done();
								}
							}
						);
					} else {
						// We're asking for input-only
						this.configuration.config.item = action;
						this.configuration.config.webpackOptions[action] =
							answerToAction.actionAnswer;
						done();
					}
				}
			});
	}
};
