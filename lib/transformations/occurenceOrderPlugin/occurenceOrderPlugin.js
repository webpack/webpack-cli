module.exports = function(j, ast) {
	return ast
		.find(j.NewExpression)
		.filter(path => path.get('callee').value.property.name === 'OccurrenceOrderPlugin')
		.forEach(path => {
			j(path).remove();
		})
		.toSource({ quote: 'single' });
};
