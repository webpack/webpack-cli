const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-environment');
const Gen = require('./generators/index');
const generator = require('yeoman-generator');
const resolveTransform = require('./resolve-transform');

module.exports = function initTransform(opts) {

	// async, needs some hickup
	const env = yeoman.createEnv();
	env.register(require.resolve('./generators/index'), 'npm:app');
	env.run('npm:app');
	// to run below code. Also, we're testing locally now, might change

	const configFile = require(process.cwd() + '/.yo-rc.json');
	resolveTransform(configFile);
};
