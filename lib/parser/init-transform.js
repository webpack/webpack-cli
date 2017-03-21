const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-environment');
const Generator = require('yeoman-generator');
const resolveTransform = require('./resolve-transform');
const initGenerator = require('./generators/index');

module.exports = function initTransform(options) {
	if(options) {
		const env = yeoman.createEnv();
		env.register(require.resolve(options), 'npm:app');
		env.run('npm:app');
		try {
			const configFile = require(process.cwd() + '/.yo-rc.json');
			let name = path.basename(options)
			resolveTransform(configFile, name);
		} catch (e) {}
	}
	else if(!options) {
		const env = yeoman.createEnv();
		env.registerStub(initGenerator, 'npm:app');
		env.run('npm:app');
		try {
			const configFile = require(process.cwd() + '/.yo-rc.json');
			resolveTransform(configFile);
		} catch (e) {}
	}
};
