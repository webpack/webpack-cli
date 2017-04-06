"use strict";

const Generator = require("yeoman-generator");
const Input = require("webpack-addons").Input;

module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.configuration = {};
	}
	prompting() {
		return this.prompt([Input("entry", "What is the name of the entry point in your application?"),
			Input("output", "What is the name of the output directory in your application?")
		]).then((answer) => {
			this.configuration.webpackOptions = answer;
		});
	}
	config() {}
	childDependencies() {
		this.configuration.childDependencies = ["webpack-addons-preact"];
	}
	inject() {}

};
