const loaderTransform = require('./loaders/loaders');
const resolveTransform = require('./resolve/resolve');
const removeJsonLoaderTransform = require('./removeJsonLoader/removeJsonLoader');
const uglifyJsPluginTransform = require('./uglifyJsPlugin/uglifyJsPlugin');
const loaderOptionsPluginTransform = require('./loaderOptionsPlugin/loaderOptionsPlugin');
const bannerPluginTransform = require('./bannerPlugin/bannerPlugin');
const extractTextPluginTransform = require('./extractTextPlugin/extractTextPlugin');
const removeDeprecatedPluginsTransform = require('./removeDeprecatedPlugins/removeDeprecatedPlugins');

module.exports = {
	loaderTransform,
	resolveTransform,
	removeJsonLoaderTransform,
	uglifyJsPluginTransform,
	loaderOptionsPluginTransform,
	bannerPluginTransform,
	extractTextPluginTransform,
	removeDeprecatedPluginsTransform
};
