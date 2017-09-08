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
		const copy = (filePath) => {
			const sourceParts = [__dirname, 'templates'];
			sourceParts.push.apply(sourceParts, filePath.split('/'));
			const targetParts = path.dirname(filePath).split('/');
			targetParts.push(path.basename(filePath, '.tpl'));

			this.fs.copy(
				path.join.apply(null, sourceParts),
				this.destinationPath(path.join.apply(null, targetParts))
			);
		};

		// Plugin source
		copy('src/cjs.js.tpl');
		this.fs.copyTpl(
			path.join(__dirname, 'templates', 'src', '_index.js.tpl'),
			this.destinationPath(path.join('src', 'index.js')),
			{ name: _.upperFirst(_.camelCase(this.props.name)) }
		);

		// Tests
		copy('test/test-utils.js.tpl');
		copy('test/functional.test.js.tpl');

		// Examples
		copy('examples/simple/src/index.js.tpl');
		copy('examples/simple/src/lazy-module.js.tpl');
		copy('examples/simple/src/static-esm-module.js.tpl');
		this.fs.copyTpl(
			path.join(__dirname, 'templates', 'examples', 'simple', 'webpack.config.js.tpl'),
			this.destinationPath(path.join('examples', 'simple', 'webpack.config.js')),
			{ name: _.upperFirst(_.camelCase(this.props.name)) }
		);
	}

	install() {
		this.npmInstall(['webpack-defaults', 'bluebird'], { 'save-dev': true }).then(() => {
			this.spawnCommand('npm', ['run', 'webpack-defaults']);
		});
	}
}

module.exports = {
	PluginGenerator,
};
