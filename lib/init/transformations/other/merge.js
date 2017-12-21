"use strict";

/**
 *
 * Transform for merge. Finds the merge property from yeoman and creates a way
 * for users to allow webpack-merge in their scaffold
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function(j, ast, webpackProperties, action) {
	function createMergeProperty(p) {
		// FIXME Use j.callExp()
		let exportsDecl = p.value.body.map(n => {
			if (n.expression) {
				return n.expression.right;
			}
		});
		const bodyLength = exportsDecl.length;
		let newVal = {};
		newVal.type = "ExpressionStatement";
		newVal.expression = {
			type: "AssignmentExpression",
			operator: "=",
			left: {
				type: "MemberExpression",
				computed: false,
				object: j.identifier("module"),
				property: j.identifier("exports")
			},
			right: j.callExpression(j.identifier("merge"), [
				j.identifier(webpackProperties),
				exportsDecl.pop()
			])
		};
		p.value.body[bodyLength - 1] = newVal;
	}
	if (webpackProperties) {
		return ast.find(j.Program).filter(p => createMergeProperty(p));
	} else {
		return ast;
	}
};
