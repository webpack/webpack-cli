const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-environment');
const Generator = require('yeoman-generator');
const initGenerator = require('./generators/index');

/*
* @function initTransform
*
* Runs yeoman and in the future lets us grab the answers from the generators
*
* @param { Array } options - An Array of paths to match generators for
* @returns { <Void> }
*/

module.exports = function initTransform(options) {
	if(options) {
		const env = yeoman.createEnv();
		env.register(require.resolve(options), 'npm:app');
		env.run('npm:app');
		try {
			let name = path.basename(options);
			console.log('Done!');
			//eslint-disable-next-line
		} catch (e) {}
	}
	else if(!options) {
		const env = yeoman.createEnv();
		env.registerStub(initGenerator, 'npm:app');
		env.run('npm:app');
		try {
			console.log('Done!');
			// eslint-disable-next-line
		} catch (e) {}
	}
};
