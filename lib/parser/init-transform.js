const fs = require('fs');
const path = require('path');
const transform = require('./transformations').transform;

module.exports = function initTransform(opts) {
	global.options = opts;
	const templateFP = path.join(__dirname, 'utils', 'template.js');
	const template = fs.readFileSync(templateFP, 'utf8');
	const ast = transform(template);
	try {
		const logicPath = process.cwd() + '/webpack.config.js';
		fs.writeFileSync(logicPath, ast, 'utf8');
		return logicPath;
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
