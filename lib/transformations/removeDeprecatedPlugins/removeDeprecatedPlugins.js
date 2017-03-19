const codeFrame = require('babel-code-frame');
const utils = require('../utils');

module.exports = function(j, ast, source) {
	// List of deprecated plugins to remove
	// each item refers to webpack.optimize.[NAME] construct
	const deprecatedPlugingsList = [
		'webpack.optimize.OccurrenceOrderPlugin',
		'webpack.optimize.DedupePlugin'
	];

	return utils.findPluginsByName(j, ast, deprecatedPlugingsList)
		.forEach(path => {
			// For now we only support the case there plugins are defined in an Array
			if (path.parent &&
				path.parent.value &&
				utils.isType(path.parent.value, 'ArrayExpression')
			) {
				// Check how many plugins are defined and
				// if there is only last plugin left remove `plugins: []` node
				if(path.parent.value.elements.length === 1) {
					j(path.parent.parent).remove();
				} else {
					j(path).remove();
				}
			} else {
				const startLoc = path.value.loc.start;
				console.error(`For now only plugins instantiated in an array can be removed.
${ codeFrame(source, startLoc.line, startLoc.column, { highlightCode: true }) }
Please remove deprecated plugins manually. 
See https://webpack.js.org/guides/migrating/ for more information.`);
			}
		});
};
