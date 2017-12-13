const Generator = require("yeoman-generator");
const glob = require("glob-all");
const PROP_TYPES = require("../utils/prop-types");
const List = require("webpack-addons").List;
const Input = require("webpack-addons").Input;

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
				this.prompt([
					Input("actionAnswer", `what do you want to add to ${action}?`)
				]).then(answerToAction => {
					if (action === ("plugins" || "loader")) {
						//
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
										`const ${pluginName} = require("${answerToAction.actionAnswer}")`
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
						this.configuration.config.item = action;
						this.configuration.config.webpackOptions[action] = "hello";
						done();
					}
				});
			});
	}
};
