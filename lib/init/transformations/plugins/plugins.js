"use strict";

const utils = require("../../../utils/ast-utils");

/*
*
* Transform for plugins. Finds the plugins property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties, action) {
	function createPluginsProperty(p) {
		const pluginArray = utils.createArrayWithChildren(
			j,
			"plugins",
			webpackProperties,
			true
		);
		return p.value.properties.push(pluginArray);
	}
	if (webpackProperties) {
		if (Array.isArray(webpackProperties) && action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createPluginsProperty));
		} else if (action === "add") {
			return utils
				.findRootNodesByName(j, ast, "plugins")
				.filter(p =>
					p.value.value.elements.push(
						utils.createEmptyCallableFunctionWithArguments(j, webpackProperties)
					)
				);
		} else if (action === "remove") {
			return utils
				.findRootNodesByName(j, ast, "plugins")
				.filter(p =>
					p.value.value.elements.filter(name => name !== webpackProperties)
				);
		}
	} else {
		return ast;
	}
};
