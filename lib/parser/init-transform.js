const jscodeshift = require('jscodeshift');
const fs = require('fs');
const path = require('path');

module.exports = function initTransform(opts) {

	const templateFP = path.join(__dirname, 'utils', 'template.js');
	const template = fs.readFileSync(templateFP, 'utf8');
	const ast = jscodeshift(template);

};
