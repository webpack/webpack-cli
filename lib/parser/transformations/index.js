const jscodeshift = require('jscodeshift');
const addLoadersTransform = require('./loaders/loaders');
const addEntryTransform = require('./entry/entry');
const addOutputTransform = require('./output/output');
const addResolveTransform = require('./resolve/resolve');

const transformations = {
	addEntryTransform,
	addOutputTransform,
	addResolveTransform,
	addLoadersTransform
};

function transform(source, transforms, options) {
	const ast = jscodeshift(source);
	const recastOptions = Object.assign({
		quote: 'single'
	}, options);
	transforms = transforms || Object.keys(transformations).map(k => transformations[k]);
	transforms.forEach(f => f(jscodeshift, ast));
	return ast.toSource(recastOptions);
}

module.exports = {
	transform,
	transformations
};
