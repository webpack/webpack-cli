const loaderTransform = require('./loaders/loaders');
const resolveTransform = require('./resolve/resolve');
const removeJsonLoaderTransform = require('./removeJsonLoader/removeJsonLoader');

module.exports = {
	loaderTransform: loaderTransform,
	resolveTransform: resolveTransform,
	removeJsonLoaderTransform: removeJsonLoaderTransform
};
