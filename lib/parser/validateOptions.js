const fs = require('fs');
const path = require('path');

function getPath(part) {
	return path.join(process.cwd(), part);
}

module.exports = function validateOptions(opts) {
	return Object.keys(opts).forEach( (location) => {
		let part = getPath(opts[location]);
		try {
			fs.readFileSync(part);
		} catch (err) {
			console.error('Found no file at:', part);
			process.exit(0);
		}
	});
};
/*

const fs = require('fs');
const path = require('path');
const Rx = require('rxjs');

function getPath(part) {
	return path.join(process.cwd(), part);
}

const readFileObservable = Rx.Observable.bindNodeCallback(fs.readFileSync);

module.exports = function validateOptions(opts) {
	return Rx.Observable.pairs(opts)
	.map(([, opt]) => getPath(opt))
	.flatMap(part => readFileObservable(part))
	.then(part, err => {
		console.error('Found no file at:', part);
	});
};

*/
