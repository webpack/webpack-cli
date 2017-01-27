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
