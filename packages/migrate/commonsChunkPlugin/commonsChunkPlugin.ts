import {
	addOrUpdateConfigObject,
	createIdentifierOrLiteral,
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
							p.value.elements.forEach((chunkName) => {
								if (chunkName.value === "runtime") {
									optimizationProps["runtimeChunk"] = j.objectExpression([ // tslint:disable-line
										createProperty(j, "name", chunkName.value),
									]);
								} else {
									chunkCount++;
									if (!Array.isArray(cacheGroup[chunkName.value])) {
										cacheGroup[chunkName.value] = [];
									}
								}
							});
							break;

						case "name":
							chunkCount++;
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
						case "minChunks":
							const { value: pathValue }: INode = p;

							// minChunk is a function
							if (
								pathValue.type === "ArrowFunctionExpression" ||
								pathValue.type === "FunctionExpression"
							) {
								if (!Array.isArray(cacheGroup[chunkKey])) {
									cacheGroup[chunkKey] = [];
								}
								cacheGroup[chunkKey].push(
									j.property(
										"init",
										createIdentifierOrLiteral(j, "test"),
										pathValue,
									),
								);
							}
							break;
					}
				},
			);

			Object.keys(cacheGroup).forEach((chunkName) => {
				const chunkProps: INode[] = [
					createProperty(j, "name", chunkName),
				];

				if (isAsyncChunk) {
					chunkProps.push(j.property(
						"init",
						createIdentifierOrLiteral(j, "minChunks"),
						createIdentifierOrLiteral(j, chunkCount),
					));
				} else {
					chunkProps.push(...commonCacheGroupsProps,
						j.property(
						"init",
						createIdentifierOrLiteral(j, "minChunks"),
						createIdentifierOrLiteral(j, chunkCount),
					));
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

		Object.keys(optimizationProps).forEach((key) => {
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
