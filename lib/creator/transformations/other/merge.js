const isAssignment = require('../../utils/is-assignment');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createMergeProperty(p) {
		// FIXME Use j.callExp()
		let exportsDecl = p.value.body.map( (n) => {
			if(n.expression) {
				return n.expression.right;
			}
		});
		const bodyLength = exportsDecl.length;
		let newVal = {};
		newVal.type = 'ExpressionStatement';
		newVal.expression = {
			type: 'AssignmentExpression',
			operator: '=',
			left: {
				type: 'MemberExpression',
				computed: false,
				object: j.identifier('module'),
				property: j.identifier('exports')
			},
			right: j.callExpression(
					j.identifier('merge'),
					[j.identifier(webpackProperties['merge']), exportsDecl.pop()])
		};
		p.value.body[bodyLength - 1] = newVal;
	}
	if(webpackProperties['merge']) {
		return ast.find(j.Program).filter(p => isAssignment(p, createMergeProperty));
	} else {
		return ast;
	}
};
