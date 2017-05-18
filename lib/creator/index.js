const yeoman = require('yeoman-environment');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const path = require('path');
const defaultGenerator = require('webpack-addons').WebpackGenerator;
const runTransform = require('webpack-addons').initTransform;
const WebpackAdapter = require('./utils/webpack-adapter');
/*
* @function creator
*
* Runs yeoman and runs the transformations based on the object
* built up from an author/user
*
* @param { String } options - An path to the given generator
* @returns { Function } runTransform - Run transformations based on yeoman prompt
*/

function creator(options) {
	let env = yeoman.createEnv('webpack', null, new WebpackAdapter());
	const generatorName = options ? replaceGeneratorName(path.basename(options[0])) : 'webpack-default-generator';
	if(options) {
		const WebpackGenerator = class extends Generator {
			initializing() {
				options.forEach( (path) => {
					return this.composeWith(require.resolve(path));
				});
			}
		};
		env.registerStub(WebpackGenerator, generatorName);
	} else {
		env.registerStub(defaultGenerator, 'webpack-default-generator');
	}

	return env.run(generatorName).on('end', () => {
		if(generatorName === 'webpack-default-generator') {
			return runTransform(env.configuration).then( (didFinish) => {
				if(didFinish) {
					process.stdout.write('\n' + chalk.green(
						'Congratulations! Your new webpack configuration file has been created!\n'
					));
				} else {
					process.stdout.write('\n' + chalk.red(
						'Sorry! Your webpack configuration did not fully succeed !\n'
					));
				}
			});
		}
	});
}

/*
* @function replaceGeneratorName
*
* Replaces the webpack-addons pattern with the end of the addons name merged
* with 'generator'
*
* @param { String } name - name of the generator
* @returns { String } name - replaced pattern of the name
*/

function replaceGeneratorName(name) {
	return name.replace(
		/(webpack-addons)?([^:]+)(:.*)?/g, 'generator$2');
}

module.exports = {
	creator,
	replaceGeneratorName
};
