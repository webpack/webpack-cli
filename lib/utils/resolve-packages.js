const {spawn} = require('child_process');
const parser = require('../parser/index');
const path = require('path');
const chalk = require('chalk');

function processPromise(child) {
	return new Promise(function(resolve, reject) { //eslint-disable-line
		child.addListener('error', reject);
		child.addListener('exit', resolve);
	});
}
function spawnChild(pkg) {
	// spawn('npm', ['install', '--save', pkg], { stdio: 'inherit', customFds: [0, 1, 2] });
	return spawn('npm', ['install', '--save', pkg]);
}

module.exports = function resolvePackages(pkg) {
	return processPromise(spawnChild(pkg)).then( (result) => {
		let packageModule;
		try {
			let loc = path.join('..', '..', 'node_modules', pkg);
			packageModule = require(loc);
			parser(packageModule, null);
		} catch(err) {
			console.log('Package wasn\'t validated correctly..');
			console.log('Submit an issue for', pkg, 'if this persists');
			console.log('\nReason: \n');
			Error.stackTraceLimit = 30;
			console.error(chalk.bold.red(err));
			process.exit(0);
		}
	}).catch(err => {
		console.log('Package Coudln\'t be installed, aborting..');
		process.exit(0);
	});
};
