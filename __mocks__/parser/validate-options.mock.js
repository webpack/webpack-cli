const fs = require('fs');
const path = require('path');

function getPath(part) {
	return path.join(process.cwd(), part);
}

function validateOptions(opts) {
	return Object.keys(opts).forEach( (location) => {
		let part = getPath(opts[location]);
		try {
			fs.readFileSync(part);
		} catch (err) {
			throw new Error('Did not find the file');
		}
	});
}

module.exports = {
	validateOptions
};
