import {
	addOrUpdateConfigObject,
	createIdentifierOrLiteral,
	createProperty,
	findAndRemovePluginByName,
	findPluginsByName,
	findRootNodesByName
} from "@webpack-cli/utils/ast-utils";

import { JSCodeshift, Node } from "../types/NodePath";

// merge test entry prop and function expression. case 6[x]
// TODO: set the proper type once moved to @types/jscodeshift
// eslint-disable-next-line
const mergeTestPropArrowFunction = (j, chunkKey, testFunc): any => {
	return j.property(
		"init",
		createIdentifierOrLiteral(j, "test"),
		j.arrowFunctionExpression(
			[j.identifier("module")],
			j.blockStatement([
				j.ifStatement(
					j.callExpression(
						j.memberExpression(
							j.callExpression(j.memberExpression(j.identifier("module"), j.identifier("getChunks")), []),
							j.identifier("some"),
							false
						),
						[
							j.arrowFunctionExpression(
								[j.identifier("chunk")],
								j.binaryExpression(
									"===",
									j.memberExpression(j.identifier("chunk"), j.identifier("name")),
									j.literal(chunkKey)
								)
							)
						]
					),
					j.returnStatement(j.literal(true))
				),
				j.variableDeclaration("const", [j.variableDeclarator(j.identifier("fn"), testFunc)]),
				j.returnStatement(j.callExpression(j.identifier("fn"), [j.identifier("module")]))
			])
		)
	);
};

/**
 *
 * Transform for CommonsChunkPlugin. If found, removes the
 * plugin and sets optimizations.namedModules to true
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
export default function(j: JSCodeshift, ast: Node): Node {
	const splitChunksProps: Node[] = [];
	const cacheGroupsProps: Node[] = [];
	const optimizationProps: object = {};

	let commonCacheGroupsProps: Node[] = [createProperty(j, "chunks", "initial"), createProperty(j, "enforce", true)];

	// find old options
	const CommonsChunkPlugin: Node = findPluginsByName(j, ast, ["webpack.optimize.CommonsChunkPlugin"]);

	if (!CommonsChunkPlugin.size()) {
		return ast;
	}

	// cache group options based on keys
	let cacheGroup: object = {};
	let cacheGroups: Node[] = [];

	// iterate each CommonsChunkPlugin instance
	CommonsChunkPlugin.forEach((path: Node): void => {
		const CCPProps: Node[] = (path.value as Node).arguments[0].properties;

		// reset chunks from old props
		cacheGroup = {};
		cacheGroups = [];

		commonCacheGroupsProps = [createProperty(j, "chunks", "initial"), createProperty(j, "enforce", true)];

		let chunkKey: string;
		let chunkCount = 0;

		// iterate CCP props and map SCP props
		CCPProps.forEach((p: Node): void => {
			const propKey: string = p.key.name;

			switch (propKey) {
				case "names":
					(p.value as Node).elements.forEach(({ value: chunkValue }): void => {
						if (chunkValue === "runtime") {
							optimizationProps["runtimeChunk"] = j.objectExpression([
								createProperty(j, "name", chunkValue)
							]);
						} else {
							if (!Array.isArray(cacheGroup[chunkValue as string])) {
								cacheGroup[chunkValue as string] = [];
							}

							findRootNodesByName(j, ast, "entry").forEach(({ value }): void => {
								const { properties: entries } = (value as Node).value as Node;
								chunkCount = entries.length;
								entries.forEach(({ key: { name: entryName } }): void => {
									if (entryName === chunkValue) {
										cacheGroup[chunkValue as string].push(createProperty(j, "test", entryName));
									}
								});
							});
						}
					});
					break;

				case "name": {
					const nameKey = (p.value as Node).value as string;

					if (nameKey === "runtime") {
						optimizationProps["runtimeChunk"] = j.objectExpression([createProperty(j, "name", nameKey)]);
					} else {
						chunkKey = nameKey;

						if (!Array.isArray(cacheGroup[nameKey])) {
							cacheGroup[nameKey] = [];
						}

						findRootNodesByName(j, ast, "entry").forEach(({ value }): void => {
							const { properties: entries } = (value as Node).value as Node;
							chunkCount = entries.length;
							entries.forEach(({ key: { name: entryName } }): void => {
								if (entryName === nameKey) {
									cacheGroup[nameKey].push(createProperty(j, "test", entryName));
								}
							});
						});
					}
					break;
				}

				case "filename":
					if (chunkKey) {
						if (!Array.isArray(cacheGroup[chunkKey])) {
							cacheGroup[chunkKey] = [];
						}
						cacheGroup[chunkKey].push(createProperty(j, propKey, (p.value as Node).value as string));
					}
					break;

				case "async":
					if (!Array.isArray(cacheGroup[chunkKey])) {
						cacheGroup[chunkKey] = [];
					}
					cacheGroup[chunkKey].push(createProperty(j, "chunks", "async"));
					break;

				case "minSize":
					if (!Array.isArray(cacheGroup[chunkKey])) {
						cacheGroup[chunkKey] = [];
					}
					cacheGroup[chunkKey].push(
						j.property("init", createIdentifierOrLiteral(j, propKey), p.value as Node)
					);
					break;

				case "minChunks": {
					const { value: pathValue }: Node = p;

					// minChunk is a function
					if (
						(pathValue as Node).type === "ArrowFunctionExpression" ||
						(pathValue as Node).type === "FunctionExpression"
					) {
						if (!Array.isArray(cacheGroup[chunkKey])) {
							cacheGroup[chunkKey] = [];
						}

						// eslint-disable-next-line
						cacheGroup[chunkKey] = cacheGroup[chunkKey].map((prop): string | void =>
							prop.key.name === "test" ? mergeTestPropArrowFunction(j, chunkKey, pathValue) : prop
						);
					}
					break;
				}
			}
		});

		Object.keys(cacheGroup).forEach((chunkName: string): void => {
			let chunkProps: Node[] = [createProperty(j, "name", chunkName)];

			const chunkPropsToAdd = cacheGroup[chunkName];
			const chunkPropsKeys = chunkPropsToAdd.map((prop): string => prop.key.name);

			commonCacheGroupsProps = commonCacheGroupsProps.filter(
				(commonProp): boolean => !chunkPropsKeys.includes(commonProp.key.name)
			);

			chunkProps.push(...commonCacheGroupsProps);

			if (chunkCount > 1) {
				chunkProps.push(
					j.property(
						"init",
						createIdentifierOrLiteral(j, "minChunks"),
						createIdentifierOrLiteral(j, chunkCount)
					)
				);
			}

			const chunkPropsContainTest = chunkPropsToAdd.some(
				(prop): boolean => prop.key.name === "test" && prop.value.type === "Literal"
			);

			if (chunkPropsContainTest) {
				chunkProps = chunkProps.filter((prop): boolean => prop.key.name !== "minChunks");
			}

			if (chunkPropsToAdd && Array.isArray(chunkPropsToAdd) && chunkPropsToAdd.length > 0) {
				chunkProps.push(...chunkPropsToAdd);
			}

			cacheGroups.push(
				j.property("init", createIdentifierOrLiteral(j, chunkName), j.objectExpression([...chunkProps]))
			);
		});

		if (cacheGroups.length > 0) {
			cacheGroupsProps.push(...cacheGroups);
		}
	});

	// Remove old plugin
	const root: Node = findAndRemovePluginByName(j, ast, "webpack.optimize.CommonsChunkPlugin");

	const rootProps: Node[] = [...splitChunksProps];

	if (cacheGroupsProps.length > 0) {
		rootProps.push(
			j.property("init", createIdentifierOrLiteral(j, "cacheGroups"), j.objectExpression([...cacheGroupsProps]))
		);
	}

	// Add new optimizations splitChunks option
	if (root) {
		addOrUpdateConfigObject(j, root, "optimizations", "splitChunks", j.objectExpression([...rootProps]));

		Object.keys(optimizationProps).forEach((key: string): void => {
			addOrUpdateConfigObject(j, root, "optimizations", key, optimizationProps[key]);
		});
	}

	return ast;
}
