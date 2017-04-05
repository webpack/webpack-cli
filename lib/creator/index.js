const yeoman = require('yeoman-environment');
const Generator = require('yeoman-generator');
const defaultGenerator = require('./generators/init-generator');
const WebpackAdapter = require('./yeoman/webpack-adapter');
const runTransform = require('./transformations/index');

/*
* @function creator
*
* Runs yeoman and runs the transformations based on the object
* built up from an author/user
*
* @param { String } options - An path to the given generator
* @returns { Function } runTransform - Run transformations based on yeoman prompt
*/

module.exports = function creator(options) {
	const env = yeoman.createEnv(null, null, new WebpackAdapter());

	if(options) {
		env.register(require.resolve(options), 'npm:app');

		env.run('npm:app')
		.on('end', () => {
			return runTransform(env.getArgument('configuration'));
		});

	} else {
		env.registerStub(defaultGenerator, 'npm:app');

		env.run('npm:app')
		.on('end', () => {
			return runTransform(env.getArgument('configuration'));
		});
	}
};
