const Generator = require("yeoman-generator");
const createDevConfig = require("./utils/dev-config");
const questions = require("./utils/question");

module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		opts.env.configuration = {
			dev: {
				mode: "env.production ? 'production' : 'development'",
				devtool: "env.production ? 'source-maps' : 'eval'",
				webpackOptions: (answer) => createDevConfig(answer),
				topScope: [
					"const path = require(\"path\")",
					"const webpack = require(\"webpack\")",
				],
			}
		};
	}

	prompting() {
		return this.prompt(questions).then(answer => {
			this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
			this.options.env.configuration.dev.configName = answer.configName;

		});
	}
	writing() {
		this.config.set("configuration", this.options.env.configuration);
	}
};
