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

		// Loader source
		copy('src/cjs.js.tpl');
		this.fs.copyTpl(
			path.join(__dirname, 'templates', 'src', '_index.js.tpl'),
			this.destinationPath(path.join('src', 'index.js')),
			{ name: this.props.name }
		);

		// Tests
		copy('test/test-utils.js.tpl');
		copy('test/unit.test.js.tpl');
		copy('test/functional.test.js.tpl');
		copy('test/fixtures/simple-file.js.tpl');

		// Examples
		copy('examples/simple/webpack.config.js.tpl');
		copy('examples/simple/src/index.js.tpl');
		copy('examples/simple/src/lazy-module.js.tpl');
		copy('examples/simple/src/static-esm-module.js.tpl');
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
