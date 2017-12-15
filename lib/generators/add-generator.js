const Generator = require("yeoman-generator");
const glob = require("glob-all");
const List = require("webpack-addons").List;
const Input = require("webpack-addons").Input;

const schema = require("webpack/schemas/WebpackOptions");
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
		let manualOrListInput;
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
				const schemaProp = schema.definitions[action];
				if (schemaProp) {
					if (schemaProp.properties) {
						manualOrListInput = List(
							"actionAnswer",
							`what do you want to add to ${action}?`,
							Object.keys(schemaProp.properties)
						);
						isDeepProp[0] = true;
					} else {
						// needs a twerky mc twerk
						let schemaTypeOfRequirement;
						if (schemaProp.oneOf) {
							schemaTypeOfRequirement = schemaProp.oneOf;
						} else {
							schemaTypeOfRequirement = schemaProp.anyOf;
						}
						const propsForAction = Object.keys(schemaTypeOfRequirement).map(
							e => schemaTypeOfRequirement[e]
						);
						//	console.log(propsForAction);
						//	process.exit(0);
						manualOrListInput = List(
							"actionAnswer",
							`what do you want to add to ${action}?`,
							propsForAction
						);
						isDeepProp[0] = true;
					}
				} else {
					manualOrListInput = Input(
						"actionAnswer",
						`what do you want to add to ${action}?`
					);
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
