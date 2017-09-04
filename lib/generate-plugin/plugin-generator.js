const path = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const Generator = require('yeoman-generator');

/**
 * A yeoman generator class for creating a webpack
 * plugin project. It adds some starter plugin code
 * and runs `webpack-defaults`.
 *
 * @class PluginGenerator
 * @extends {Generator}
 */
class PluginGenerator extends Generator {
	prompting() {
		const prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'Plugin name',
				default: 'my-webpack-plugin',
				filter: _.kebabCase,
				validate: str => str.length > 0,
			},
		];

		return this.prompt(prompts).then(props => {
			this.props = props;
		});
	}

	default() {
		if (path.basename(this.destinationPath()) !== this.props.name) {
			this.log(
				'Your plugin must be inside a folder named ' +
				this.props.name +
				'\nI will create this folder for you.'
			);
			mkdirp(this.props.name);
			this.destinationRoot(this.destinationPath(this.props.name));
		}
	}

	writing() {
		this.fs.copyTpl(
			path.join(__dirname, 'templates', 'src', '_index.js.tpl'),
			this.destinationPath('src/index.js'),
			{ name: _.upperFirst(_.camelCase(this.props.name)) }
		);

		this.fs.copy(
			path.join(__dirname, 'templates', 'src', 'cjs.js.tpl'),
			this.destinationPath('src/cjs.js')
		);
	}

	install() {
		this.npmInstall(['webpack-defaults'], { 'save-dev': true }).then(() => {
			this.spawnCommand('npm', ['run', 'webpack-defaults']);
		});
	}
}

module.exports = {
	PluginGenerator,
};
