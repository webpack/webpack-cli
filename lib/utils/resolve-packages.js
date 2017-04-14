const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const creator = require('../creator/index').creator;
const globalPath = require('global-modules');
/*
* @function processPromise
*
* Attaches a promise to the installation of the package
*
* @param { Function } child - The function to attach a promise to
* @returns { <Promise> } promise - Returns a promise to the installation
*/

function processPromise(child) {
	return new Promise(function(resolve, reject) { //eslint-disable-line
		child.addListener('error', reject);
		child.addListener('exit', resolve);
	});
}

/*
* @function spawnChild
*
* Spawns a new process that installs the addon/dependency
*
* @param { String } pkg - The dependency to be installed
* @returns { <Function> } spawn - Installs the package
*/

function spawnChild(pkg) {
	// Different for windows, needs fix
	let pkgPath = globalPath + '/' + pkg;
	if(fs.existsSync(pkgPath)) {
		// HACK / FIXME -> npm update right away doesn't install the updated pkg.
		spawn('rm', ['-rf', pkgPath], { stdio: 'inherit', customFds: [0, 1, 2] });
		return spawn('npm', ['install', '-g', pkg], { stdio: 'inherit', customFds: [0, 1, 2] });
	} else {
		return spawn('npm', ['install', '-g', pkg], { stdio: 'inherit', customFds: [0, 1, 2] });
	}
}

/*
* @function resolvePackages
*
* Resolves and installs the packages, later sending them to @creator
*
* @param { Array <String> } pkg - The dependencies to be installed
* @returns { <Function|Error> } creator - Builds
* a webpack configuration through yeoman or throws an error
*/

module.exports = function resolvePackages(pkg) {
	Error.stackTraceLimit = 30;

	let packageLocations = [];

	pkg.forEach( (addon) => {
		processPromise(spawnChild(addon)).then( () => {
			try {
				// Different for windows, needs fix
				packageLocations.push(path.join('/usr', 'local', 'lib', 'node_modules', addon));
			} catch(err) {
				console.log('Package wasn\'t validated correctly..');
				console.log('Submit an issue for', pkg, 'if this persists');
				console.log('\nReason: \n');
				console.error(chalk.bold.red(err));
				process.exit(1);
			}
		}).catch(err => {
			console.log('Package Coudln\'t be installed, aborting..');
			console.log('\nReason: \n');
			console.error(chalk.bold.red(err));
			process.exit(1);
		}).then( () => {
			if(packageLocations.length === pkg.length) return creator(packageLocations);
		});
	});
};
