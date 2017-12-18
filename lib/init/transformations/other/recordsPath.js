"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for recordsPath. Finds the recordsPath property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function recordsPathTransform(
	j,
	ast,
	webpackProperties,
	action
) {
	function createRecordsPathProperty(p) {
		utils.pushCreateProperty(j, p, "recordsPath", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "recordsPath");
	}
	if (webpackProperties) {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createRecordsPathProperty));
		} else if (action === "init" && webpackProperties.length) {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"recordsPath",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const recordsPathNode = utils.findRootNodesByName(j, ast, "recordsPath");
			if (
				recordsPathNode.size() !== 0 &&
				typeof webpackProperties === "object"
			) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"recordsPath"
					)
					.filter(p => {
						Object.keys(webpackProperties).forEach(prop => {
							utils.checkIfExistsAndAddValue(
								j,
								p,
								prop,
								utils.createIdentifierOrLiteral(j, webpackProperties[prop])
							);
						});
						return ast;
					});
			} else if (recordsPathNode.size() !== 0 && webpackProperties.length > 0) {
				return recordsPathNode.forEach(p => {
					j(p).replaceWith(
						j.property(
							"init",
							utils.createIdentifierOrLiteral(j, "recordsPath"),
							utils.createIdentifierOrLiteral(j, webpackProperties)
						)
					);
				});
			} else {
				return recordsPathTransform(j, ast, webpackProperties, "init");
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
