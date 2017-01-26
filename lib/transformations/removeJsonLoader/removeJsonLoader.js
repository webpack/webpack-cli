const safeTraverse = require('../safeTraverse');

module.exports = function(j, ast) {
	return ast.toSource();
};
