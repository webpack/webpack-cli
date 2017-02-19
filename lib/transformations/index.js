const jscodeshift = require('jscodeshift');

const loadersTransform = require('./loaders/loaders');
const resolveTransform = require('./resolve/resolve');
const removeJsonLoaderTransform = require('./removeJsonLoader/removeJsonLoader');
const uglifyJsPluginTransform = require('./uglifyJsPlugin/uglifyJsPlugin');
const loaderOptionsPluginTransform = require('./loaderOptionsPlugin/loaderOptionsPlugin');
const bannerPluginTransform = require('./bannerPlugin/bannerPlugin');
const extractTextPluginTransform = require('./extractTextPlugin/extractTextPlugin');
const removeDeprecatedPluginsTransform = require('./removeDeprecatedPlugins/removeDeprecatedPlugins');

const transformations = {
	loadersTransform,
	resolveTransform,
	removeJsonLoaderTransform,
	uglifyJsPluginTransform,
	loaderOptionsPluginTransform,
	bannerPluginTransform,
	extractTextPluginTransform,
	removeDeprecatedPluginsTransform
};

/*
* @function transform
*
* Tranforms a given source code by applying selected transformations to the AST
*
* @param { String } source - Source file contents
* @param { Array<Function> } transformations - List of trnasformation functions in defined the
* order to apply. By default all defined transfomations.
* @param { Object } options - Reacst formatting options
* @returns { String } Transformed source code
* */
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
