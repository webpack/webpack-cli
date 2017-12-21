"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for resolveLoader. Finds the resolveLoader property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function resolveLoaderTransform(
	j,
	ast,
	webpackProperties,
	action
) {
	function createResolveLoaderProperty(p) {
		if (typeof webpackProperties === "string") {
			return utils.pushCreateProperty(j, p, "resolveLoader", webpackProperties);
		}
		if (Array.isArray(webpackProperties)) {
			const externalArray = utils.createArrayWithChildren(
				j,
				"resolveLoader",
				webpackProperties,
				true
			);
			return p.value.properties.push(externalArray);
		} else {
			utils.pushCreateProperty(j, p, "resolveLoader", j.objectExpression([]));
			return utils.pushObjectKeys(j, p, webpackProperties, "resolveLoader");
		}
	}
	function editResolveLoaderProperty(p) {
		return utils.pushObjectKeys(j, p, webpackProperties, "resolveLoader", true);
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createResolveLoaderProperty));
		} else if (action === "add") {
			const resolveLoaderNode = utils.findRootNodesByName(
				j,
				ast,
				"resolveLoader"
			);
			if (
				resolveLoaderNode.size() !== 0 &&
				typeof webpackProperties === "object"
			) {
				return ast
					.find(j.ObjectExpression)
					.filter(p => utils.isAssignment(null, p, editResolveLoaderProperty));
			} else if (resolveLoaderNode.size() !== 0 && webpackProperties.length) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"resolveLoader"
					)
					.forEach(p => {
						j(p).replaceWith(
							utils.createIdentifierOrLiteral(j, webpackProperties)
						);
					});
			} else {
				return resolveLoaderTransform(j, ast, webpackProperties, "init");
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
