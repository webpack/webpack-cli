const jscodeshift = require("jscodeshift");
const pEachSeries = require("p-each-series");
const PLazy = require("p-lazy");

const loadersTransform = require("./loaders/loaders");
const resolveTransform = require("./resolve/resolve");
const removeJsonLoaderTransform = require("./removeJsonLoader/removeJsonLoader");
const uglifyJsPluginTransform = require("./uglifyJsPlugin/uglifyJsPlugin");
const loaderOptionsPluginTransform = require("./loaderOptionsPlugin/loaderOptionsPlugin");
const bannerPluginTransform = require("./bannerPlugin/bannerPlugin");
const extractTextPluginTransform = require("./extractTextPlugin/extractTextPlugin");
const removeDeprecatedPluginsTransform = require("./removeDeprecatedPlugins/removeDeprecatedPlugins");

const transformsObject = {
	loadersTransform,
	resolveTransform,
	removeJsonLoaderTransform,
	uglifyJsPluginTransform,
	loaderOptionsPluginTransform,
	bannerPluginTransform,
	extractTextPluginTransform,
	removeDeprecatedPluginsTransform
};

const transformations = Object.keys(transformsObject).reduce((res, key) => {
	res[key] = (ast, source) =>
		transformSingleAST(ast, source, transformsObject[key]);
	return res;
}, {});

function transformSingleAST(ast, source, transformFunction) {
	return new PLazy((resolve, reject) => {
		setTimeout(_ => {
			try {
				resolve(transformFunction(jscodeshift, ast, source));
			} catch (err) {
				reject(err);
			}
		}, 0);
	});
}

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
	const recastOptions = Object.assign(
		{
			quote: "single"
		},
		options
	);
	transforms =
		transforms || Object.keys(transformations).map(k => transformations[k]);
	return pEachSeries(transforms, f => f(ast, source))
		.then(_ => {
			return ast.toSource(recastOptions);
		})
		.catch(err => {
			console.error(err);
		});
}

module.exports = {
	transform,
	transformSingleAST,
	transformations
};
