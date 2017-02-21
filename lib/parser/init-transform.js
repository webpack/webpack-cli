const jscodeshift = require('jscodeshift');
const fs = require('fs');
const path = require('path');
let transforms = require('./transformations/index');

module.exports = function initTransform(opts) {

	const templateFP = path.join(__dirname, 'utils', 'template.js');
	const template = fs.readFileSync(templateFP, 'utf8');
	const ast = jscodeshift(template);
	const recastOptions = Object.assign({
		quote: 'single'
	});
	Object.keys(transforms).forEach(f => {
		transforms[f](jscodeshift, ast);
	});
//	return ast.toSource(recastOptions);
};
