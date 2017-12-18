"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for recordsInputPath. Finds the recordsInputPath property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function recordsInputPathTransform(
	j,
	ast,
	webpackProperties,
	action
) {
	function createRecordsInputPathProperty(p) {
		utils.pushCreateProperty(j, p, "recordsInputPath", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "recordsInputPath");
	}
	if (webpackProperties) {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(null, p, createRecordsInputPathProperty)
				);
		} else if (action === "init" && webpackProperties.length) {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"recordsInputPath",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const recordsInputPathNode = utils.findRootNodesByName(
				j,
				ast,
				"recordsInputPath"
			);
			if (
				recordsInputPathNode.size() !== 0 &&
				typeof webpackProperties === "object"
			) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"recordsInputPath"
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
			} else if (
				recordsInputPathNode.size() !== 0 &&
				webpackProperties.length > 0
			) {
				return utils
					.findRootNodesByName(j, ast, "recordsInputPath")
					.forEach(p => {
						j(p).replaceWith(
							j.property(
								"init",
								utils.createIdentifierOrLiteral(j, "recordsInputPath"),
								utils.createIdentifierOrLiteral(j, webpackProperties)
							)
						);
					});
			} else {
				return recordsInputPathTransform(j, ast, webpackProperties, "init");
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
