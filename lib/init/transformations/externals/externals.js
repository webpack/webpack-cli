"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for externals. Finds the externals property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function externalsTransform(
	j,
	ast,
	webpackProperties,
	action
) {
	function createExternalProperty(p) {
		if (
			webpackProperties instanceof RegExp ||
			typeof webpackProperties === "string"
		) {
			return utils.pushCreateProperty(j, p, "externals", webpackProperties);
		}
		if (Array.isArray(webpackProperties)) {
			const externalArray = utils.createArrayWithChildren(
				j,
				"externals",
				webpackProperties,
				true
			);
			return p.value.properties.push(externalArray);
		} else {
			utils.pushCreateProperty(j, p, "externals", j.objectExpression([]));
			return utils.pushObjectKeys(j, p, webpackProperties, "externals");
		}
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(
					p =>
						utils.safeTraverse(p, [
							"parent",
							"value",
							"left",
							"property",
							"name"
						]) === "exports"
				)
				.forEach(createExternalProperty);
		} else if (action === "add") {
			const externalNode = utils.findRootNodesByName(j, ast, "externals");
			if (externalNode.size() !== 0 && typeof webpackProperties === "object") {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"externals"
					)
					.filter(p => {
						Object.keys(webpackProperties).forEach(prop => {
							// need to check for every prop beneath, use the recursion util
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
				externalNode.size() !== 0 &&
				Array.isArray(webpackProperties)
			) {
				// Todo
			} else if (externalNode.size() !== 0 && webpackProperties.length) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"externals"
					)
					.forEach(p => {
						j(p).replaceWith(
							utils.createIdentifierOrLiteral(j, webpackProperties)
						);
					});
			} else {
				return externalsTransform(j, ast, webpackProperties, "init");
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
