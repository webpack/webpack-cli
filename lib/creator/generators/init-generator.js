const Generator = require('yeoman-generator');
const Input = require('webpack-addons').Input;
const runTransform = require('./init-transforms');


module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.childDependencies = [];
		this.webpackOptions = {};
	}
	transform() {
		console.log(runTransform(this.webpackOptions));
	}
	prompting() {
		return this.prompt([Input('entry','What is the name of the entry point in your application?'),
			Input('output','What is the name of the output directory in your application?')]).then( (answer) => {
				this.webpackOptions = answer;
			});
	}
	config() {}
	childDependencies() {
		this.childDependencies =  ['webpack-addons-preact'];
	}
	inject() {}

};
