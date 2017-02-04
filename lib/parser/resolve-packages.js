const spawn = require('child_process').spawn;
const path = require('path');
const transform = require('./transform');

function processPromise(child) {
	return new Promise(function(resolve, reject) {
		child.addListener('error', reject);
		child.addListener('exit', resolve);
	});
}
function spawnChild(pkg) {
	// spawn('npm', ['install', '--save', pkg], { stdio: 'inherit', customFds: [0, 1, 2] });
	return spawn('npm', ['install', '--save', pkg]);
}

module.exports = function resolvePackages(option) {
	option.packages.filter( (pkg) => {
		processPromise(spawnChild(pkg)).then( (result) => {
			let packageModule;
			try {
				let loc = path.join('..', '..', 'node_modules', pkg);
				packageModule = require(loc);
			} catch(err) {
				console.log('Package wasn\'t validated correctly..');
				console.log('Submit an issue for', pkg, 'if this persists');
				process.exit(0);
			} finally {
				// validate the package through @pksjce´s module.
			}
		}).catch(err => {
			console.log('Package Coudln\'t be installed, aborting..');
			process.exit(0);
		});
		return transform(); // @pksjce 's migration rules etc..'
	});
};
