const Generator = require("yeoman-generator");
const PROP_TYPES = require("../utils/prop-types");
const RawList = require("webpack-addons").RawList;

module.exports = class UpdateGenerator extends Generator {
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
				"What property do you want to update?",
				Array.from(PROP_TYPES.keys())
			)
		])
			.then(actionTypeAnswer => {
				done();
				this.configuration.config.webpackOptions[
					actionTypeAnswer.actionType
				] = null;
				action = actionTypeAnswer.actionType;
			})
			.then(() => {
				this.prompt([
					RawList(
						"actionAnswer",
						`what do you want to update to ${action}?`
						/*types*/
					)
				]).then(answerToAction => {
					console.log(answerToAction);
				});
			});
	}
};
