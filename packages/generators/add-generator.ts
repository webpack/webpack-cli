import * as Generator from "yeoman-generator";
import npmExists from "@webpack-cli/utils/npm-exists";
import { getPackageManager } from "@webpack-cli/utils/package-manager";
import { Input, List } from "@webpack-cli/webpack-scaffold";
import webpackDevServerSchema from "webpack-dev-server/lib/options.json";
import * as AutoComplete from "inquirer-autocomplete-prompt";
import path, { resolve } from "path";
import glob from "glob-all";

import {
	actionTypeQuestion,
	entryTypeQuestion,
	manualOrListInput,
	mergeFileQuestion,
	topScopeQuestion
} from "./utils/add/questions";
import { traverseAndGetProperties } from "./utils/add";
import { SchemaProperties, WebpackOptions } from "./types";
import entryQuestions from "./utils/entry";
import { generatePluginName } from "./utils/plugins";
import webpackSchema from "../optionsSchema.json";

/**
 *
 * Generator for adding properties
 * @class	AddGenerator
 * @extends	Generator
 * @returns	{Void} After execution, transforms are triggered
 *
 */

export default class AddGenerator extends Generator {
	private dependencies: string[];
	private configuration: {
		config: {
			configName?: string;
			topScope?: string[];
			item?: string;
			merge?: string | string[];
			webpackOptions?: WebpackOptions;
		};
	};

	public constructor(args, opts) {
		super(args, opts);
		this.dependencies = [];
		this.configuration = {
			config: {
				topScope: ["const webpack = require('webpack')"],
				webpackOptions: {}
			}
		};
		const { registerPrompt } = this.env.adapter.promptModule;
		registerPrompt("autocomplete", AutoComplete);
	}

	public prompting(): Promise<void | {}> {
		const done: () => {} = this.async();
		let action: string;
		const self: this = this;
		let inputPrompt: Generator.Question;

		// first index indicates if it has a deep prop, 2nd indicates what kind of
		// TODO: this must be reviewed. It starts as an array of booleans but after that it get overridden
		// Bye bye functional programming.
		// eslint-disable-next-line
		const isDeepProp: any[] = [false, false];

		return this.prompt(actionTypeQuestion)
			.then(
				(actionTypeAnswer: { actionType: string }): void => {
					// Set initial prop, like devtool
					this.configuration.config.webpackOptions[actionTypeAnswer.actionType] = null;
					// update the action variable, we're using it later
					action = actionTypeAnswer.actionType;
				}
			)
			.then(
				(): Promise<void | {}> => {
					if (action === "entry") {
						return this.prompt(entryTypeQuestion)
							.then(
								(entryTypeAnswer: { entryType: boolean }): Promise<void | {}> => {
									// Ask different questions for entry points
									return entryQuestions(self, entryTypeAnswer.entryType);
								}
							)
							.then(
								(entryOptions: { entryType: boolean }): void => {
									this.configuration.config.webpackOptions.entry = entryOptions;
									this.configuration.config.item = action;
								}
							);
					} else {
						if (action === "topScope") {
							return this.prompt(topScopeQuestion).then(
								(topScopeAnswer: { topScope: string }): void => {
									this.configuration.config.topScope.push(topScopeAnswer.topScope);
									done();
								}
							);
						}
						if (action === "merge") {
							return this.prompt(mergeFileQuestion).then(
								(mergeFileAnswer: { mergeFile: string; mergeConfigName: string }): void => {
									const resolvedPath = resolve(process.cwd(), mergeFileAnswer.mergeFile);
									this.configuration.config[action] = [mergeFileAnswer.mergeConfigName, resolvedPath];
									done();
								}
							);
						}
					}
					const temp = action;
					if (action === "resolveLoader") {
						action = "resolve";
					}
					const webpackSchemaProp: SchemaProperties = webpackSchema.definitions[action];
					/*
					 * https://github.com/webpack/webpack/blob/next/schemas/WebpackOptions.json
					 * Find the properties directly in the properties prop, or the anyOf prop
					 */
					let defOrPropDescription: object = webpackSchemaProp
						? webpackSchemaProp.properties
						: webpackSchema.properties[action].properties
						? webpackSchema.properties[action].properties
						: webpackSchema.properties[action].anyOf
						? webpackSchema.properties[action].anyOf.filter(
								(p: { properties?: object; enum?: string[] }): boolean => !!p.properties || !!p.enum
						  )
						: null;
					if (Array.isArray(defOrPropDescription)) {
						// Todo: Generalize these to go through the array, then merge enum with props if needed
						const hasPropertiesProp: boolean = traverseAndGetProperties(defOrPropDescription, "properties");
						const hasEnumProp: boolean = traverseAndGetProperties(defOrPropDescription, "enum");
						/* as we know he schema only has two arrays that might hold our values,
						 * check them for either having arr.enum or arr.properties
						 */
						if (hasPropertiesProp) {
							defOrPropDescription =
								defOrPropDescription[0].properties || defOrPropDescription[1].properties;
							if (!defOrPropDescription) {
								defOrPropDescription = defOrPropDescription[0].enum;
							}
							// TODO: manually implement stats and devtools like sourcemaps
						} else if (hasEnumProp) {
							const originalPropDesc: object = defOrPropDescription[0].enum;
							// Array -> Object -> Merge objects into one for compat in manualOrListInput
							defOrPropDescription = Object.keys(defOrPropDescription[0].enum)
								.map(
									(p: string): object => {
										return Object.assign(
											{},
											{
												[originalPropDesc[p]]: "noop"
											}
										);
									}
								)
								.reduce((result: object, currentObject: object): object => {
									for (const key in currentObject) {
										if (currentObject.hasOwnProperty(key)) {
											result[key] = currentObject[key];
										}
									}
									return result;
								}, {});
						}
					}
					// WDS has its own schema, so we gonna need to check that too
					const webpackDevserverSchemaProp: SchemaProperties =
						action === "devServer" ? webpackDevServerSchema : null;
					// Watch has a boolean arg, but we need to append to it manually
					if (action === "watch") {
						defOrPropDescription = {
							false: {},
							true: {}
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
									"cheap-eval-source-map": {},
									"cheap-module-eval-source-map": {},
									"cheap-module-source-map": {},
									"cheap-source-map": {},
									eval: {},
									"eval-source-map": {},
									"hidden-source-map": {},
									"inline-cheap-module-source-map": {},
									"inline-cheap-source-map": {},
									"inline-source-map": {},
									"nosources-source-map": {},
									"source-map": {}
								});
							}
							inputPrompt = List(
								"actionAnswer",
								`What do you want to add to ${action}?`,
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
							inputPrompt = List(
								"actionAnswer",
								`What do you want to add to ${action}?`,
								Object.keys(webpackDevserverSchemaProp.properties)
							);
							// We know we are in a devServer.prop scenario
							isDeepProp[0] = true;
						} else {
							// manual input if non-existent
							inputPrompt = manualOrListInput(action);
						}
					} else {
						inputPrompt = manualOrListInput(action);
					}
					return this.prompt([inputPrompt]);
				}
			)
			.then(
				(answerToAction: { actionAnswer: string }): Promise<void | {}> => {
					if (!answerToAction) {
						done();
						return;
					}
					/*
					 * Plugins got their own logic,
					 * find the names of each natively plugin and check if it matches
					 */
					if (action === "plugins") {
						let answeredPluginName = answerToAction.actionAnswer;
						let isPrefixPresent = /webpack./.test(answeredPluginName);

						if (isPrefixPresent) {
							answeredPluginName = answeredPluginName.replace("webpack.", "").trim();
						} else {
							answeredPluginName = answeredPluginName.trim();
						}
						const pluginExist: string = glob
							.sync(["node_modules/webpack/lib/*Plugin.js", "node_modules/webpack/lib/**/*Plugin.js"])
							.map(
								(p: string): string =>
									p
										.split("/")
										.pop()
										.replace(".js", "")
							)
							.find(
								(p: string): boolean =>
									p.toLowerCase().indexOf(answeredPluginName) >= 0 ||
									p.indexOf(answeredPluginName) >= 0
							);

						if (pluginExist) {
							this.configuration.config.item = pluginExist;
							const pluginsSchemaPath: string = glob
								.sync([
									"node_modules/webpack/schemas/plugins/*Plugin.json",
									"node_modules/webpack/schemas/plugins/**/*Plugin.json"
								])
								.find(
									(p: string): boolean =>
										p
											.split("/")
											.pop()
											.replace(".json", "")
											.indexOf(pluginExist) >= 0
								);
							if (pluginsSchemaPath) {
								const constructorPrefix: string =
									pluginsSchemaPath.indexOf("optimize") >= 0 ? "webpack.optimize" : "webpack";
								const resolvePluginsPath: string = path.resolve(pluginsSchemaPath);
								const pluginSchema: object = resolvePluginsPath ? require(resolvePluginsPath) : null;
								let pluginsSchemaProps: string[] = ["other"];
								if (pluginSchema) {
									Object.keys(pluginSchema)
										.filter((p: string): boolean => Array.isArray(pluginSchema[p]))
										.forEach(
											(p: string): void => {
												Object.keys(pluginSchema[p]).forEach(
													(n: string): void => {
														if (pluginSchema[p][n].properties) {
															pluginsSchemaProps = Object.keys(
																pluginSchema[p][n].properties
															);
														}
													}
												);
											}
										);
								}

								return this.prompt([
									List(
										"pluginsPropType",
										`What property do you want to add ${pluginExist}?`,
										pluginsSchemaProps
									)
								]).then(
									(pluginsPropAnswer: { pluginsPropType: string }): Promise<void | {}> => {
										return this.prompt([
											Input(
												"pluginsPropTypeVal",
												`What value should ${pluginExist}.${
													pluginsPropAnswer.pluginsPropType
												} have?`
											)
										]).then(
											(valForProp: { pluginsPropTypeVal: string }): void => {
												this.configuration.config.webpackOptions[action] = {
													[`${constructorPrefix}.${pluginExist}`]: {
														[pluginsPropAnswer.pluginsPropType]:
															valForProp.pluginsPropTypeVal
													}
												};
												done();
											}
										);
									}
								);
							} else {
								this.configuration.config.webpackOptions[action] = `new webpack.${pluginExist}`;
								done();
							}
						} else {
							// If its not in webpack, check npm
							npmExists(answerToAction.actionAnswer).then(
								(p: boolean): void => {
									if (p) {
										this.dependencies.push(answerToAction.actionAnswer);
										const pluginName = generatePluginName(answerToAction.actionAnswer);
										this.configuration.config.topScope.push(
											`const ${pluginName} = require("${answerToAction.actionAnswer}")`
										);
										this.configuration.config.webpackOptions[action] = `new ${pluginName}`;
										this.configuration.config.item = answerToAction.actionAnswer;
										done();
										this.scheduleInstallTask(getPackageManager(), this.dependencies, {
											"save-dev": true
										});
									} else {
										console.error(
											answerToAction.actionAnswer,
											"doesn't exist on NPM or is built in webpack, please check for any misspellings."
										);
										process.exit(0);
									}
								}
							);
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
								(this.configuration.config.webpackOptions[
									action
								] as string) = answerToAction.actionAnswer;
								done();
								return;
							}
							// Either we are adding directly at the property, else we're in a prop.theOne scenario
							const actionMessage =
								isDeepProp[1] === "other"
									? `What do you want the key on ${action} to be? (press enter if you want it directly as a value on the property)`
									: `What do you want the value of ${isDeepProp[1]} to be?`;

							this.prompt([Input("deepProp", actionMessage)]).then(
								(deepPropAns: { deepProp: string }): void => {
									// The other option needs to be validated of either being empty or not
									if (isDeepProp[1] === "other") {
										const othersDeepPropKey: string = deepPropAns.deepProp
											? `What do you want the value of ${deepPropAns.deepProp} to be?` // eslint-disable-line
											: `What do you want to be the value of ${action} to be?`;
										// Push the answer to the array we have created, so we can use it later
										isDeepProp.push(deepPropAns.deepProp);
										this.prompt([Input("innerProp", othersDeepPropKey)]).then(
											(innerPropAns: { innerProp }): void => {
												// Check length, if it has none, add the prop directly on the given action
												if (isDeepProp[2].length === 0) {
													this.configuration.config.item = action;
													this.configuration.config.webpackOptions[action] =
														innerPropAns.innerProp;
												} else {
													// If not, we're adding to something like devServer.myProp
													this.configuration.config.item = action + "." + isDeepProp[2];
													this.configuration.config.webpackOptions[action] = {
														[isDeepProp[2]]: innerPropAns.innerProp
													};
												}
												done();
											}
										);
									} else {
										// We got the schema prop, we've correctly prompted it, and can add it directly
										this.configuration.config.item = `${action}.${isDeepProp[1]}`;
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
							this.configuration.config.webpackOptions[action] = answerToAction.actionAnswer;
							done();
						}
					}
				}
			);
	}

	public writing(): void {
		this.config.set("configuration", this.configuration);
	}
}
