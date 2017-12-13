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

module.exports = function entry(j, ast, webpackProperties, action) {
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
			let node = utils.findRootNodesByName(j, ast, "entry");
			if (node) {
				node.filter(p => {
					if (p.value.value.type === "ObjectExpression") {
						// add key value
					}
				});
			} else {
				return entry(j, ast, "k", "init");
			}
			return node;
		}
	} else {
		return ast;
	}
};
