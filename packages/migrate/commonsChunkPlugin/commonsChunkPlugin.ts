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
	const cacheGroupsProps: INode[] = [];
	const splitChunksProps: INode[] = [];

	// find old options
	const CommonsChunkPlugin = findPluginsByName(j, ast, ["webpack.optimize.CommonsChunkPlugin"]);

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
					if (chunkName.value === "runtime") {
						splitChunksProps.push(
							createProperty(
								j,
								"runtimeChunk",
								true,
							),
						);
					} else {
						cacheGroupsProps.push(
							createChunkCache(chunkName),
						);
					}
				});
				break;
			case "name":
				cacheGroupsProps.push(
					createChunkCache(p.value),
				);
				break;
			case "async":
				cacheGroupsProps.push(
					createProperty(
						j,
						"chunks",
						"async",
					),
				);
				break;
			case "minSize":
			case "minChunks":
			const { value: pathValue } = p;
			let propValue;

			if (pathValue.name === "Infinity") {
				propValue = Infinity;
			} else {
				propValue = pathValue.value;
			}

			cacheGroupsProps.push(
				createProperty(
					j,
					p.key.name,
					propValue,
				),
			);
			break;
		}
	});

	// Remove old plugin
	const root: INode = findAndRemovePluginByName(j, ast, "webpack.optimize.CommonsChunkPlugin");

	const rootProps = [
		...splitChunksProps,
	];

	if (cacheGroupsProps.length > 0) {
		rootProps.push(
			...cacheGroupsProps,
		);
	}

	// Add new optimizations splitChunks option
	if (root) {
		addOrUpdateConfigObject(
			j,
			root,
			"optimizations",
			"splitChunks",
			j.objectExpression([
				...rootProps,
			]),
		);
	}

	return ast;
}
