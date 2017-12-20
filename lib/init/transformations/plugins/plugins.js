"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for plugins. Finds the plugins property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function pluginsTransform(j, ast, webpackProperties, action) {
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
			const pluginsNode = utils.findRootNodesByName(j, ast, "plugins");
			if (pluginsNode.size() !== 0) {
				return pluginsNode.filter(p => {
					let node = utils.createFunctionWithArguments(j, p, webpackProperties);
					if (node) {
						p.value.value.elements.push(node);
					} else {
						return null;
					}
				});
			} else {
				return pluginsTransform(j, ast, [webpackProperties], "init");
			}
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
