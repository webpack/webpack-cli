const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-environment');
const Generator = require('yeoman-generator');
const initGenerator = require('./generators/index');
const WebpackAdapter = require('./generators/adapter');

/*
* @function initTransform
*
* Runs yeoman and in the future lets us grab the answers from the generators
*
* @param { Array } options - An Array of paths to match generators for
* @returns { <Void> }
*/

module.exports = function initTransform(options) {
	const creator = require('./index');
	const env = yeoman.createEnv(null, null, new WebpackAdapter());

	if(options) {
		env.register(require.resolve(options), 'npm:app');

		env.run('npm:app')
		.on('end', () => {
			return creator(null, env.getArgument('configuration'));
		});

	} else {
		env.registerStub(initGenerator, 'npm:app');

		env.run('npm:app')
		.on('end', () => {
			return creator(null, env.getArgument('configuration'));
		});
	}
};
