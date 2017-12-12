const Generator = require("yeoman-generator");
const glob = require("glob-all");
const PROP_TYPES = require("../utils/prop-types");
const RawList = require("webpack-addons").RawList;
const Input = require("webpack-addons").Input;

//const getPackageManager = require("../utils/package-manager").getPackageManager;
const npmExists = require("../utils/npm-exists");

module.exports = class AddGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.dependencies = [];
		this.configuration = {
			config: {
				webpackOptions: {},
				topScope: []
			}
		};
	}

	prompting() {
		let done = this.async();
		let action;
		this.prompt([
			RawList(
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
							this.configuration.config.webpackOptions[action] = pluginExist;
							done();
						} else {
							// check at npm or throw
							npmExists(answerToAction.actionAnswer).then(p => {
								if (p) {
									this.dependencies.push(answerToAction.actionAnswer);
									this.configuration.config.webpackOptions[action] =
										answerToAction.actionAnswer;
									done();
									/*
									this.runInstall(getPackageManager(), this.dependencies, {
										"save-dev": true
									});
									*/
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
						// prompt for properties
					}
				});
			});
	}
};
