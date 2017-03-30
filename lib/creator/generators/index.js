const Generator = require('yeoman-generator');
const Input = require('webpack-addons').Input;


module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.myConfig = {
			inquirer: [],
			config: {},
			childDependencies: []
		};
	}
	Inquirer() {
		this.myConfig.inquirer = [
			Input('entry','What is the name of the entry point in your application?'),
			Input('output','What is the name of the output directory in your application?')
		];
	}
	Config() {
		this.myConfig.config = {
			entry: ' ',
			output: ' '
		};
	}
	childDependencies() {
		this.myConfig.childDependencies = ['webpack-addons-preact'];
	}
	inject() {}
};
