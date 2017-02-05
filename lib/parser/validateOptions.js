const fs = require('fs');
const path = require('path');

function getPath(part) {
	return path.join(process.cwd(), part);
}
module.exports = function validateOptions(opts) {
	[getPath(opts.entry), getPath(opts.output)].forEach( (part) => {
		try {
			fs.readFileSync(part);
		} catch (err) {
			console.error('No such file as: ', part);
			process.exit(0);
		}
	});
};
