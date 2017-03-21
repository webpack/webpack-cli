const Generator = require('yeoman-generator');
const {Input} = require('webpack-addons');


class WebpackGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}
	Inquirer() {
		this.config.set('inquirer', [
			Input('entry','What is the name of the entry point in your application?'),
			Input('output','What is the name of the output directory in your application?')
		]
	);
	}
	Config() {
		this.config.set('config', {
			entry: ' ',
			output: ' '
		});
	}
	childDependencies() {
		this.config.set('childDependencies', [
			'webpack-addons-preact'
		]);
	}
	inject() {}
}

module.exports = WebpackGenerator;
