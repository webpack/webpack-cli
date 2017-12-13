"use strict";

const utils = require("../../../utils/ast-utils");

/*
*
* Transform for entry. Finds the entry property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function entryTransform(j, ast, webpackProperties, action) {
	function createEntryProperty(p) {
		if (typeof webpackProperties === "string") {
			return utils.pushCreateProperty(j, p, "entry", webpackProperties);
		}
		if (Array.isArray(webpackProperties)) {
			const externalArray = utils.createArrayWithChildren(
				j,
				"entry",
				webpackProperties,
				true
			);
			return p.value.properties.push(externalArray);
		} else {
			utils.pushCreateProperty(j, p, "entry", j.objectExpression([]));
			return utils.pushObjectKeys(j, p, webpackProperties, "entry");
		}
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createEntryProperty));
		} else if (action === "add") {
			if (utils.findRootNodesByName(j, ast, "entry").size() !== 0) {
				// TODO inject props
				return ast
					.find(j.ObjectExpression)
					.filter(p => utils.pushObjectKeys(j, p, { hey: "Ho" }, "entry"));
			} else {
				// TODO: inject props
				return entryTransform(
					j,
					ast,
					{
						app: "index.js"
					},
					"init"
				);
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
