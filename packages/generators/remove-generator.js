const Generator = require("yeoman-generator");
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
	}

	prompting() {
		const done = this.async();

		return this.prompt([
			List(
				"actionType",
				"What property do you want to remove?",
				Array.from(PROP_TYPES.keys())
			)
		])
			.then(actionTypeAnswer => {
				this.configuration.config.webpackOptions[
					actionTypeAnswer.actionType
				] = null;
				done();
			});
	}

	writing() {
		this.config.set("configuration", this.configuration);
	}
};
