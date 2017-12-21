"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for module. Finds the module property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function moduleTransform(j, ast, webpackProperties, action) {
	function createModuleProperty(p) {
		if (typeof webpackProperties === "string") {
			return utils.pushCreateProperty(j, p, "module", webpackProperties);
		}
		if (Array.isArray(webpackProperties)) {
			const externalArray = utils.createArrayWithChildren(
				j,
				"module",
				webpackProperties,
				true
			);
			return p.value.properties.push(externalArray);
		} else {
			utils.pushCreateProperty(j, p, "module", j.objectExpression([]));
			return utils.pushObjectKeys(j, p, webpackProperties, "module");
		}
	}
	function editModuleProperty(p) {
		return utils.pushObjectKeys(j, p, webpackProperties, "module", true);
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createModuleProperty));
		} else if (action === "add") {
			const moduleNode = utils.findRootNodesByName(j, ast, "module");
			if (moduleNode.size() !== 0 && typeof webpackProperties === "object") {
				return ast
					.find(j.ObjectExpression)
					.filter(p => utils.isAssignment(null, p, editModuleProperty));
			} else if (moduleNode.size() !== 0 && webpackProperties.length) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"module"
					)
					.forEach(p => {
						j(p).replaceWith(
							utils.createIdentifierOrLiteral(j, webpackProperties)
						);
					});
			} else {
				return moduleTransform(j, ast, webpackProperties, "init");
			}
		} else if (action === "remove") {
			// TODO
		} else if (action === "update") {
			// TODO
		}
	} else {
		return ast;
	}
};
