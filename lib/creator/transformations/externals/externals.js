"use strict";

const utils = require("../../../transformations/utils");

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

module.exports = function(j, ast, webpackProperties) {
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
	} else {
		return ast;
	}
};
