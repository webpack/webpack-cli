const loaderTransform = require('./loaders/loaders');
const resolveTransform = require('./resolve/resolve');
const removeJsonLoaderTransform = require('./removeJsonLoader/removeJsonLoader');
const uglifyJsPluginTransform = require('./uglifyJsPlugin/uglifyJsPlugin');

module.exports = {
	loaderTransform: loaderTransform,
	resolveTransform: resolveTransform,
	removeJsonLoaderTransform: removeJsonLoaderTransform,
	uglifyJsPluginTransform: uglifyJsPluginTransform
};
