'use strict';
const path = require('path');

function mockPromise(value) {
	return (value || {}).then ? value : {
		then: function (callback) {
			return mockPromise(callback(value));
		}
	};
}
function spawnChild(pkg) {
	return pkg;
}

function getLoc(option) {
	let packageModule = [];
	option.filter( (pkg) => {
		mockPromise(spawnChild(pkg)).then( () => {
			try {
				let loc = path.join('..', '..', 'node_modules', pkg);
				packageModule.push(loc);
			} catch(err) {
				throw new Error('Package wasn\'t validated correctly..' +
				'Submit an issue for', pkg, 'if this persists');
			}
		});
		return packageModule;
	});
	return packageModule;
}

module.exports = getLoc;
