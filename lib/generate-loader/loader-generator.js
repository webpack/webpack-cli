const path = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const Generator = require('yeoman-generator');

/**
 * Formats a string into webpack loader format
 * (eg: 'style-loader', 'raw-loader')
 *
 * @param {string} name A loader name to be formatted
 * @returns {string} The formatted string
 */
function makeLoaderName(name) {
	name = _.kebabCase(name);
	if (!/loader$/.test(name)) {
		name += '-loader';
	}
	return name;
}

/**
 * A yeoman generator class for creating a webpack
 * loader project. It adds some starter loader code
 * and runs `webpack-defaults`.
 *
 * @class LoaderGenerator
 * @extends {Generator}
 */
class LoaderGenerator extends Generator {
	prompting() {
		const prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'Loader name',
				default: 'my-loader',
				filter: makeLoaderName,
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
				'Your loader must be inside a folder named ' +
				this.props.name +
				'\nI will create this folder for you.'
			);
			mkdirp(this.props.name);
			this.destinationRoot(this.destinationPath(this.props.name));
		}
	}

	writing() {
		/**
		 * Loader source
		 */

		this.fs.copyTpl(
			path.join(__dirname, 'templates', 'src', '_index.js.tpl'),
			this.destinationPath('src/index.js'),
			{ name: this.props.name }
		);

		this.fs.copy(
			path.join(__dirname, 'templates', 'src', 'cjs.js.tpl'),
			this.destinationPath('src/cjs.js')
		);

		/**
		 * Tests
		 */

		this.fs.copy(
			path.join(__dirname, 'templates', 'test', 'test-utils.js.tpl'),
			this.destinationPath('test/test-utils.js')
		);

		this.fs.copy(
			path.join(__dirname, 'templates', 'test', 'unit.test.js.tpl'),
			this.destinationPath('test/unit.test.js')
		);

		this.fs.copy(
			path.join(__dirname, 'templates', 'test', 'functional.test.js.tpl'),
			this.destinationPath('test/functional.test.js')
		);

		this.fs.copy(
			path.join(__dirname, 'templates', 'test', 'fixtures', 'simple-file.js.tpl'),
			this.destinationPath('test/fixtures/simple-file.js')
		);

		/**
		 * Examples
		 */

		this.fs.copy(
			path.join(__dirname, 'templates', 'examples', 'simple', 'webpack.config.js.tpl'),
			this.destinationPath('examples/simple/webpack.config.js')
		);

		this.fs.copy(
			path.join(__dirname, 'templates', 'examples', 'simple', 'src','index.js.tpl'),
			this.destinationPath('examples/simple/src/index.js')
		);

		this.fs.copy(
			path.join(__dirname, 'templates', 'examples', 'simple', 'src','lazy-module.js.tpl'),
			this.destinationPath('examples/simple/src/lazy-module.js')
		);

		this.fs.copy(
			path.join(__dirname, 'templates', 'examples', 'simple', 'src','static-esm-module.js.tpl'),
			this.destinationPath('examples/simple/src/static-esm-module.js')
		);
	}

	install() {
		this.npmInstall(['webpack-defaults', 'bluebird'], { 'save-dev': true }).then(() => {
			this.spawnCommand('npm', ['run', 'webpack-defaults']);
		});
	}
}

module.exports = {
	makeLoaderName,
	LoaderGenerator,
};
