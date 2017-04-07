const Generator = require('yeoman-generator');
const Input = require('webpack-addons').Input;


module.exports = class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.configuration = {
			webpackOptions: {
				entry: null
			}
		};
	}
	prompting() {
		return this.prompt([Input('entry', 'What is the name of the entry point in your application?')])
		.then( (answer) => {
			/*
			this.configuration.webpackOptions.entry = {
			home: answer.entry,
			vendor: answer.entry
			}
			*/
			this.configuration.webpackOptions.entry = answer.entry;
		});
	}
	config() {}
	childDependencies() {
		this.configuration.childDependencies = ['webpack-addons-preact'];
	}
	inject() {}

};
