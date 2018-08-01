import {
	addOrUpdateConfigObject,
	createIdentifierOrLiteral,
	createLiteral,
	createProperty,
	findAndRemovePluginByName,
	findPluginsByName,
} from "@webpack-cli/utils/ast-utils";

import { IJSCodeshift, INode } from "../types/NodePath";

/**
 *
 * Transform for CommonsChunkPlugin. If found, removes the
 * plugin and sets optimizations.namedModules to true
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
export default function(j: IJSCodeshift, ast: INode): INode {

	let pluginProps: INode[];
	const cacheGroupsArray: INode[] = [];

	// find old options
	const CommonsChunkPlugin = findPluginsByName(j, ast, ["webpack.CommonsChunkPlugin"]);

	if (!CommonsChunkPlugin.size()) { return ast; }

	CommonsChunkPlugin
		.forEach((path: INode): void => {
			pluginProps = path.value.arguments[0].properties; // any node
		});

	// create chunk cache group option
	function createChunkCache(chunkName) {
		const commonProperties: INode[] = [
			createProperty(
				j,
				"name",
				chunkName.value,
			),
		];
		switch (chunkName.value) {
			case "vendor":
				return j.property(
					"init",
					createIdentifierOrLiteral(j, chunkName.value),
					j.objectExpression([
						...commonProperties,
						createProperty(
							j,
							"test",
							"/node_modules/",
						),
						createProperty(
							j,
							"chunks",
							"initial",
						),
					]),
				);
			case "common":
			case "commons":
				return j.property(
					"init",
					createIdentifierOrLiteral(j, chunkName.value),
					j.objectExpression([
						...commonProperties,
						createProperty(
							j,
							"chunks",
							"initial",
						),
					]),
				);
			default:
				return j.property(
					"init",
					createIdentifierOrLiteral(j, chunkName.value),
					j.objectExpression([
						...commonProperties,
					]),
				);
		}
	}

	// iterate old props and map new props
	pluginProps.forEach((p: INode): void => {
		switch (p.key.name) {
			case "names":
				p.value.elements.forEach((chunkName) => {
					cacheGroupsArray.push(
						createChunkCache(chunkName),
					);
				});
				break;
			case "name":
				cacheGroupsArray.push(
					createChunkCache(p.value),
				);
				break;
			case "async":
				cacheGroupsArray.push(
					createProperty(
						j,
						"chunks",
						"async",
					),
				);
				break;
			case "minSize":
			case "minChunks":
				cacheGroupsArray.push(
					createProperty(
						j,
						p.key.name,
						p.value.value,
					),
				);
				break;
		}
	});

	// Remove old plugin
	const root: INode = findAndRemovePluginByName(j, ast, "webpack.CommonsChunkPlugin");

	// Add new optimizations splitChunks option
	if (root) {
		addOrUpdateConfigObject(
			j,
			root,
			"optimizations",
			"splitChunks",
			j.objectExpression([
				j.property(
					"init",
					createIdentifierOrLiteral(j, "cacheGroup"),
					j.objectExpression(cacheGroupsArray),
				),
			]),
		);
	}

	return ast;
}
