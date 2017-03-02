const utils = require('../utils');

module.exports = function(j, ast) {
	const literalOutputPath = ast.find(j.ObjectExpression)
		.filter(p => utils.safeTraverse(p, ['parentPath', 'value', 'key', 'name']) === 'output')
		.find(j.Property)
		.filter(p => utils.safeTraverse(p, ['value', 'key', 'name']) === 'path' && utils.safeTraverse(p, ['value', 'value', 'type']) === 'Literal');
	if (literalOutputPath) {
		literalOutputPath.find(j.Literal)
			.replaceWith(p => replaceWithPath(j, p));

		const pathRequire = utils.getRequire(j, 'path', 'path');
		const isPathPresent = ast
			.find(j.VariableDeclarator)
			.filter(p => utils.safeTraverse(p, ['value', 'id', 'name']) === 'path');
		if(!isPathPresent){
			return ast.find(j.Program)
			.replaceWith(p => j.program([].concat(pathRequire).concat(p.value.body)));
		}

	}
	return ast;
};

function replaceWithPath(j, p) {
	const convertedPath = j.callExpression(
		j.memberExpression(
		j.identifier('path'),
		j.identifier('join'),
		false),
		[j.identifier('__dirname'), p.value]);
	return convertedPath;
}

