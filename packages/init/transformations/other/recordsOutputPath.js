"use strict";

const utils = require("@webpack-cli/utils/ast-utils");

/**
 *
 * Transform for recordsOutputPath. Finds the recordsOutputPath property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function recordsOutputPathTransform(
	j,
	ast,
	webpackProperties,
	action
) {
	function createRecordsOutputPathProperty(p) {
		utils.pushCreateProperty(j, p, "recordsOutputPath", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "recordsOutputPath");
	}
	if (webpackProperties) {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(null, p, createRecordsOutputPathProperty)
				);
		} else if (action === "init" && webpackProperties.length) {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"recordsOutputPath",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const recordsOutputPathNode = utils.findRootNodesByName(
				j,
				ast,
				"recordsOutputPath"
			);
			if (
				recordsOutputPathNode.size() !== 0 &&
				typeof webpackProperties === "object"
			) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"recordsOutputPath"
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
				recordsOutputPathNode.size() !== 0 &&
				webpackProperties.length > 0
			) {
				return utils
					.findRootNodesByName(j, ast, "recordsOutputPath")
					.forEach(p => {
						j(p).replaceWith(
							j.property(
								"init",
								utils.createIdentifierOrLiteral(j, "recordsOutputPath"),
								utils.createIdentifierOrLiteral(j, webpackProperties)
							)
						);
					});
			} else {
				return recordsOutputPathTransform(j, ast, webpackProperties, "init");
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
