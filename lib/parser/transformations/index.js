const addLoadersTransform = require('./loaders/loaders');
const addEntryTransform = require('./entry/entry');
const addOutputTransform = require('./output/output');
const addResolveTransform = require('./resolve/resolve');

module.exports = {
	addEntryTransform,
	addOutputTransform,
	addResolveTransform,
	addLoadersTransform
};
