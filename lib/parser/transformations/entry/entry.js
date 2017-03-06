const utils = require('../../../transformations/utils');

module.exports = function(j, ast) {
	ast.find(j.ObjectExpression).forEach(path => {
		path.value.properties.filter(prop => {
			if(prop.key.name === 'entry') {
				prop.value = j.objectExpression([
					utils.createProperty(j, 'filename', global.options.entry)
				]);
			}
			if(prop.key.name === 'output') {
				prop.value = j.objectExpression([
					utils.createProperty(j, 'filename', global.options.output)
				]);
			}
		});
	});
};
