"use strict";

const utils = require("../../../utils/ast-utils");

/*
*
* Transform for externals. Finds the externals property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
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
			if (utils.findRootNodesByName(j, ast, "externals").size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.pushObjectKeys(j, p, webpackProperties, "externals")
					);
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
