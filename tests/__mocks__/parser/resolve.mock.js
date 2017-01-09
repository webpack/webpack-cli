const parser = jest.genMockFromModule('../../../lib/parser/index.js');
const path = require('path');

function mockPromise(value) {
	return (value || {}).then ? value : {
		then: function (callback) {
			return mockPromise(callback(value));
		}
	};
}
function spawnChild(pkg) {}

function getLoc(option) {
	let packageModule;
	option.filter( (pkg) => {
		mockPromise(spawnChild(pkg)).then( (result) => {
			try {
				let loc = path.join('..', '..', 'node_modules', pkg);
				packageModule = loc;
			} catch(err) {
				console.log('Package wasn\'t validated correctly..');
				console.log('Submit an issue for', pkg, 'if this persists');
				process.exit(0);
			}
		});
		return packageModule;
	});
	return packageModule;
}

parser.getLoc = getLoc;
module.exports = parser;
