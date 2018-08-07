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

	const commonCacheGroupsProps: INode[] = [
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
	const cacheGroup: object = {};
	const cacheGroups: INode[] = [];
	let isAsyncChunk: boolean = false;

	// iterate each CommonsChunkPlugin instance
	CommonsChunkPlugin.forEach(
		(path: INode): void => {
			const CCPProps: INode[] = path.value.arguments[0].properties;

			let chunkKey: string;

			// iterate CCP props and map SCP props
			CCPProps.forEach(
				(p: INode): void => {
					const propKey: string = p.key.name;

					switch (propKey) {
						case "names":
							p.value.elements.forEach((chunkName) => {
								if (chunkName.value === "runtime") {
									optimizationProps["runtimeChunk"] = createIdentifierOrLiteral( // tslint:disable-line
										j,
										true,
									);
								} else {
									if (!Array.isArray(cacheGroup[chunkName.value])) {
										cacheGroup[chunkName.value] = [];
									}

									if (chunkName.value === "vendor") {
										cacheGroup[chunkName.value].push(
											createProperty(j, "test", "/node_modules/"),
										);
									}
								}
							});
							break;

						case "name":
							chunkKey = propKey;
							if (!Array.isArray(cacheGroup[p.value.value])) {
								cacheGroup[p.value.value] = [];
							}
							if (p.value.value === "vendor") {
								cacheGroup[p.value.value].push(
									createProperty(j, "test", "/node_modules/"),
								);
							}

						 break;

						case "async":
							splitChunksProps.push(createProperty(j, "chunks", "async"));
							isAsyncChunk = true;
						 break;

						case "minSize":
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
								break;
							}

							let propValue: INode;

							if (pathValue.name === "Infinity") {
								propValue = Infinity;
							} else {
								propValue = pathValue.value;
							}

							splitChunksProps.push(createProperty(j, p.key.name, propValue));
						 break;
					}
				},
			);

			Object.keys(cacheGroup).forEach((chunkName) => {
				const chunkProps: INode[] = [
					createProperty(j, "name", chunkName),
				];

				if (!isAsyncChunk) { chunkProps.push(...commonCacheGroupsProps); }

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

	// create root props only if cache groups props are present: 5-input
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
