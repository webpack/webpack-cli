import {
	addOrUpdateConfigObject,
	createIdentifierOrLiteral,
	createProperty,
	findAndRemovePluginByName,
	findPluginsByName,
	findRootNodesByName,
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
	const splitChunksProps: INode[] = [];
	const cacheGroupsProps: INode[] = [];
	const optimizationProps: object = {};

	let commonCacheGroupsProps: INode[] = [
		createProperty(j, "chunks", "initial"),
		createProperty(j, "enforce", true),
	];

	// find old options
	const CommonsChunkPlugin: INode = findPluginsByName(j, ast, [
		"webpack.optimize.CommonsChunkPlugin",
	]);

	if (!CommonsChunkPlugin.size()) {
		return ast;
	}

	// cache group options based on keys
	let cacheGroup: object = {};
	let cacheGroups: INode[] = [];
	let isAsyncChunk: boolean = false;

	// iterate each CommonsChunkPlugin instance
	CommonsChunkPlugin.forEach(
		(path: INode): void => {
			const CCPProps: INode[] = path.value.arguments[0].properties;

			// reset chunks from old props
			cacheGroup = {};
			cacheGroups = [];
			isAsyncChunk = false;
			commonCacheGroupsProps = [
				createProperty(j, "chunks", "initial"),
				createProperty(j, "enforce", true),
			];

			let chunkKey: string;
			let chunkCount: number = 0;

			// iterate CCP props and map SCP props
			CCPProps.forEach(
				(p: INode): void => {
					const propKey: string = p.key.name;

					switch (propKey) {
						case "names":
							p.value.elements.forEach(({ value: chunkValue }): void => {
								if (chunkValue === "runtime") {
									optimizationProps["runtimeChunk"] = j.objectExpression([ // tslint:disable-line
										createProperty(j, "name", chunkValue),
									]);
								} else {
									if (!Array.isArray(cacheGroup[chunkValue])) {
										cacheGroup[chunkValue] = [];
									}

									findRootNodesByName(j, ast, "entry").forEach(
										({ value: { value: { properties: entries }} },
									): void => {
										chunkCount = entries.length;
										entries.forEach(({ key: { name: entryName }}): void => {
											if (entryName === chunkValue) {
												cacheGroup[chunkValue].push(
													createProperty(j, "test", entryName),
												);
											}
										});
									});
								}
							});
							break;

						case "name":
							const nameKey = p.value.value;

							if (nameKey === "runtime") {
								optimizationProps["runtimeChunk"] = j.objectExpression([ // tslint:disable-line
									createProperty(j, "name", nameKey),
								]);
							} else {
								chunkKey = nameKey;

								if (!Array.isArray(cacheGroup[nameKey])) {
									cacheGroup[nameKey] = [];
								}

								findRootNodesByName(j, ast, "entry").forEach(
									({ value: { value: { properties: entries }} },
								): void => {
									chunkCount = entries.length;
									entries.forEach(({ key: { name: entryName }}): void => {
										if (entryName === nameKey) {
											cacheGroup[nameKey].push(
												createProperty(j, "test", entryName),
											);
										}
									});
								});
							}
							break;

						case "filename":
							if (chunkKey) {
								if (!Array.isArray(cacheGroup[chunkKey])) {
									cacheGroup[chunkKey] = [];
								}
								cacheGroup[chunkKey].push(
									createProperty(j, propKey, p.value.value),
								);
							}
							break;

						case "async":
							splitChunksProps.push(createProperty(j, "chunks", "async"));
							isAsyncChunk = true;
							break;

						case "minSize":
							splitChunksProps.push(
								j.property("init", createIdentifierOrLiteral(j, propKey), p.value),
							);
							break;

						case "minChunks" :
							const { value: pathValue }: INode = p;

							// minChunk is a function
							if (
								pathValue.type === "ArrowFunctionExpression" ||
								pathValue.type === "FunctionExpression"
							) {
								if (!Array.isArray(cacheGroup[chunkKey])) {
									cacheGroup[chunkKey] = [];
								}

								cacheGroup[chunkKey] = cacheGroup[chunkKey].map((prop) =>
									prop.key.name === "test" ? mergeTestPropArrowFunction(j, chunkKey, pathValue) : prop);
							}
							break;
					}
				},
			);

			Object.keys(cacheGroup).forEach((chunkName: string): void => {
				const chunkProps: INode[] = [
					createProperty(j, "name", chunkName),
				];

				const chunkPropsToAdd = [];

				if (!isAsyncChunk) {
					chunkProps.push(...commonCacheGroupsProps);
				}

				if (chunkCount > 0) {
					chunkProps.push(
						j.property(
							"init",
							createIdentifierOrLiteral(j, "minChunks"),
							createIdentifierOrLiteral(j, chunkCount),
						),
					);
				}

				if (
					cacheGroup[chunkName] &&
					Array.isArray(cacheGroup[chunkName]) &&
					cacheGroup[chunkName].length > 0
				) {
					chunkProps.push(...cacheGroup[chunkName]);
				}

				cacheGroups.push(
					j.property(
						"init",
						createIdentifierOrLiteral(j, chunkName),
						j.objectExpression([...chunkProps]),
					),
				);
			});

			if (cacheGroups.length > 0) {
				cacheGroupsProps.push(...cacheGroups);
			}
		},
	);

	// Remove old plugin
	const root: INode = findAndRemovePluginByName(
		j,
		ast,
		"webpack.optimize.CommonsChunkPlugin",
	);

	const rootProps: INode[] = [...splitChunksProps];

	if (cacheGroupsProps.length > 0) {
		rootProps.push(
			j.property(
				"init",
				createIdentifierOrLiteral(j, "cacheGroups"),
				j.objectExpression([...cacheGroupsProps]),
			),
		);
	}

	// Add new optimizations splitChunks option
	if (root) {
		addOrUpdateConfigObject(
			j,
			root,
			"optimizations",
			"splitChunks",
			j.objectExpression([...rootProps]),
		);

		Object.keys(optimizationProps).forEach((key: string): void => {
			addOrUpdateConfigObject(
				j,
				root,
				"optimizations",
				key,
				optimizationProps[key],
			);
		});
	}

	return ast;
}

// merge test entry prop and function expression. case 6[x]
const mergeTestPropArrowFunction = (j, chunkKey, testFunc) => {
	return j.property(
		"init",
		createIdentifierOrLiteral(j, "test"),
		j.arrowFunctionExpression(
			[j.identifier("module")],
			j.blockStatement([
				j.ifStatement(
					j.callExpression(
						j.memberExpression(
							j.callExpression(
								j.memberExpression(
									j.identifier("module"),
									j.identifier("getChunks"),
								),
								[],
							),
							j.identifier("some"),
							false,
						),
						[j.arrowFunctionExpression(
							[j.identifier("chunk")],
							j.binaryExpression(
								"===",
								j.memberExpression(
									j.identifier("chunk"),
									j.identifier("name"),
								),
								j.literal(chunkKey),
							),
						)],
					),
					j.returnStatement(
						j.literal(true),
					),
				),
				j.variableDeclaration(
					"const",
					[j.variableDeclarator(
						j.identifier("fn"),
						testFunc,
					)],
				),
				j.returnStatement(
					j.callExpression(
						j.identifier("fn"),
						[j.identifier("module")],
					),
				),
			]),
		),
	);
};
