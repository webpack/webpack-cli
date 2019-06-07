import * as utils from "@webpack-cli/utils/ast-utils";

import { JSCodeshift, Node } from "../types/NodePath";

/**
 *
 * Transform for loaders. Transforms pre- and postLoaders into enforce options,
 * moves loader configuration into rules array, transforms query strings and
 * props into loader options, and adds -loader suffix to loader names.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function(j: JSCodeshift, ast: Node): Node {
	/**
	 * Creates an Array expression out of loaders string
	 *
	 *
	 * For syntaxes like
	 *
	 * {
	 *   loader: 'style!css`
	 * }
	 *
	 * or
	 *
	 * {
	 *   loaders: ['style', 'css']
	 * }
	 *
	 * or
	 *
	 * loaders: [{
	 *   loader: 'style'
	 * },
	 * {
	 *   loader: 'css',
	 * }]
	 *
	 * it should generate
	 *
	 * {
	 *   use: [{
	 *     loader: 'style'
	 *   },
	 *   {
	 *     loader: 'css'
	 *   }]
	 * }
	 *
	 * @param  {Node} path - object expression ast
	 * @returns {Node} path - object expression ast with array expression instead of loaders string
	 */

	const createArrayExpressionFromArray = (path: Node): Node => {
		const value: Node = path.value as Node;
		// Find paths with `loaders` keys in the given Object
		const paths: Node[] = value.properties.filter((prop: Node): boolean => prop.key.name.startsWith("loader"));
		// For each pair of key and value
		paths.forEach((pair: Node): void => {
			// Replace 'loaders' Identifier with 'use'
			pair.key.name = "use";
			// If the value is an Array
			if ((pair.value as Node).type === j.ArrayExpression.name) {
				// replace its elements
				const pairValue = pair.value as Node;
				pair.value = j.arrayExpression(
					pairValue.elements.map(
						(arrElement: Node): Node => {
							// If items of the array are Strings
							if (arrElement.type === j.Literal.name) {
								// Replace with `{ loader: LOADER }` Object
								return j.objectExpression([
									utils.createProperty(j, "loader", arrElement.value as Node)
								]);
							}
							// otherwise keep the existing element
							return arrElement;
						}
					)
				);
				// 	If the value is String of loaders like 'style!css'
			} else if ((pair.value as Node).type === j.Literal.name) {
				// Replace it with Array expression of loaders
				const literalValue = pair.value as Node;
				pair.value = j.arrayExpression(
					(literalValue.value as string).split("!").map(
						(loader: string): Node => {
							return j.objectExpression([utils.createProperty(j, "loader", loader)]);
						}
					)
				);
			}
		});
		return path;
	};

	/**
	 *
	 * Puts query parameters from loader value into options object
	 *
	 * @param {Node} p - object expression ast for loader object
	 * @returns {Node} objectExpression - an new object expression ast containing the query parameters
	 */

	const createLoaderWithQuery = (p: Node): Node => {
		const properties: Node[] = (p.value as Node).properties;
		const loaderValue: string = properties.reduce(
			(val: string, prop: Node): string =>
				prop.key.name === "loader" ? ((prop.value as Node).value as string) : val,
			""
		);
		const loader: string = loaderValue.split("?")[0];
		const query: string = loaderValue.split("?")[1];
		const options: Node[] = query.split("&").map(
			(option: string): Node => {
				const param: string[] = option.split("=");
				const key: string = param[0];
				const val: string | boolean = param[1] || true; // No value in query string means it is truthy value
				return j.objectProperty(j.identifier(key), utils.createLiteral(j, val));
			}
		);
		const loaderProp: Node = utils.createProperty(j, "loader", loader);
		const queryProp: Node = j.property("init", j.identifier("options"), j.objectExpression(options));
		return j.objectExpression([loaderProp, queryProp]);
	};

	/**
	 *
	 * Determine whether a loader has a query string
	 *
	 * @param {Node} p - object expression ast for loader object
	 * @returns {Boolean} hasLoaderQueryString - whether the loader object contains a query string
	 */

	const findLoaderWithQueryString = (p: Node): boolean => {
		return (p.value as Node).properties.reduce((predicate: boolean, prop: Node): boolean => {
			return (
				(utils.safeTraverse(prop, ["value", "value", "indexOf"]) &&
					((prop.value as Node).value as string).indexOf("?") > -1) ||
				predicate
			);
		}, false);
	};

	/**
	 * Check if the identifier is the `loaders` prop in the `module` object.
	 * If the path value is `loaders` and it’s located in `module` object
	 * we assume it’s the loader's section.
	 *
	 * @param {Node} path - identifier ast
	 * @returns {Boolean} isLoadersProp - whether the identifier is the `loaders` prop in the `module` object
	 */

	const checkForLoader = (path: Node): boolean =>
		(path.value as Node).name === "loaders" &&
		utils.safeTraverse(path, ["parent", "parent", "parent", "node", "key", "name"]) === "module";

	/**
	 * Puts pre- or postLoader into `loaders` object and adds the appropriate `enforce` property
	 *
	 * @param {Node} p - object expression ast that has a key for either 'preLoaders' or 'postLoaders'
	 * @returns {Node} p - object expression with a `loaders` object and appropriate `enforce` properties
	 */

	const fitIntoLoaders = (p: Node): Node => {
		let loaders: Node = null;
		(p.value as Node).properties.map((prop: Node): void => {
			const keyName = prop.key.name;
			if (keyName === "loaders") {
				loaders = prop.value as Node;
			}
		});
		(p.value as Node).properties.map((prop: Node): void => {
			const keyName = prop.key.name;
			if (keyName !== "loaders") {
				const enforceVal: string = keyName === "preLoaders" ? "pre" : "post";
				(prop.value as Node).elements.map((elem: Node): void => {
					elem.properties.push(utils.createProperty(j, "enforce", enforceVal));
					if (loaders && loaders.type === "ArrayExpression") {
						loaders.elements.push(elem);
					} else {
						prop.key.name = "loaders";
					}
				});
			}
		});
		if (loaders) {
			(p.value as Node).properties = (p.value as Node).properties.filter(
				(prop: Node): boolean => prop.key.name === "loaders"
			);
		}
		return p;
	};

	/**
	 * Find pre and postLoaders in the ast and put them into the `loaders` array
	 *
	 * @returns {Node} ast - jscodeshift ast
	 */

	const prepostLoaders = (): Node =>
		ast
			.find(j.ObjectExpression)
			.filter((p: Node): boolean => utils.findObjWithOneOfKeys(p, ["preLoaders", "postLoaders"]))
			.forEach(fitIntoLoaders);

	/**
	 * Convert top level `loaders` to `rules`
	 *
	 * @returns {Node} ast - jscodeshift ast
	 */

	const loadersToRules = (): Node =>
		ast
			.find(j.Identifier)
			.filter(checkForLoader)
			.forEach((p: Node): string => ((p.value as Node).name = "rules"));

	/**
	 * Convert `loader` and `loaders` to Array of {Rule.Use}
	 *
	 * @returns {Node} ast - jscodeshift ast
	 */

	const loadersToArrayExpression = (): Node | void =>
		ast
			.find(j.ObjectExpression)
			.filter((path: Node): boolean => utils.findObjWithOneOfKeys(path, ["loader", "loaders"]))
			.filter(
				(path: Node): boolean =>
					utils.safeTraverse(path, ["parent", "parent", "node", "key", "name"]) === "rules"
			)
			.forEach(createArrayExpressionFromArray);

	/**
	 * Find loaders with options encoded as a query string and replace the string with an options object
	 *
	 * i.e. for loader like
	 *
	 * {
	 *   loader: 'css?modules&importLoaders=1&string=test123'
	 * }
	 *
	 * it should generate
	 * {
	 *   loader: 'css-loader',
	 *   options: {
	 *     modules: true,
	 *     importLoaders: 1,
	 *     string: 'test123'
	 *   }
	 * }
	 *
	 * @returns {Node} ast - jscodeshift ast
	 */

	const loaderWithQueryParam = (): Node =>
		ast
			.find(j.ObjectExpression)
			.filter((p: Node): boolean => utils.findObjWithOneOfKeys(p, ["loader"]))
			.filter(findLoaderWithQueryString)
			.replaceWith(createLoaderWithQuery);

	/**
	 * Find nodes with a `query` key and replace it with `options`
	 *
	 * i.e. for
	 * {
	 *   query: { ... }
	 * }
	 *
	 * it should generate
	 *
	 * {
	 *   options: { ... }
	 * }
	 *
	 * @returns {Node} ast - jscodeshift ast
	 */

	const loaderWithQueryProp = (): Node =>
		ast
			.find(j.Identifier)
			.filter((p: Node): boolean => (p.value as Node).name === "query")
			.replaceWith(j.identifier("options"));

	/**
	 * Add required `-loader` suffix to a loader with missing suffix
	 * e.g. for `babel` it should generate `babel-loader`
	 *
	 * @returns {Node} ast - jscodeshift ast
	 */

	const addLoaderSuffix = (): Node =>
		ast.find(j.ObjectExpression).forEach((path: Node): void => {
			(path.value as Node).properties.forEach((prop: Node): void => {
				if (
					prop.key.name === "loader" &&
					utils.safeTraverse(prop, ["value", "value"]) &&
					!((prop.value as Node).value as string).endsWith("-loader")
				) {
					prop.value = j.literal(((prop.value as Node).value as string) + "-loader");
				}
			});
		});

	/**
	 *
	 * Puts options object outside use object into use object
	 *
	 * @param {Node} p - object expression ast that has a key for either 'options' or 'use'
	 * @returns {Node} objectExpression - an use object expression ast containing the options and loader
	 */

	const fitOptionsToUse = (p: Node): Node => {
		let options: Node = null;
		(p.value as Node).properties.forEach((prop: Node): void => {
			const keyName: string = prop.key.name;
			if (keyName === "options") {
				options = prop;
			}
		});

		if (options) {
			(p.value as Node).properties = (p.value as Node).properties.filter(
				(prop: Node): boolean => prop.key.name !== "options"
			);

			(p.value as Node).properties.forEach((prop: Node): void => {
				const keyName = prop.key.name;
				if (keyName === "use") {
					(prop.value as Node).elements[0].properties.push(options);
				}
			});
		}

		return p;
	};

	/**
	 * Move `options` inside the Array of {Rule.Use}
	 *
	 * @returns {Node} ast - jscodeshift ast
	 */

	const moveOptionsToUse = (): Node =>
		ast
			.find(j.ObjectExpression)
			.filter((p: Node): boolean => utils.findObjWithOneOfKeys(p, ["use"]))
			.forEach(fitOptionsToUse);

	const transforms = [
		prepostLoaders,
		loadersToRules,
		loadersToArrayExpression,
		loaderWithQueryParam,
		loaderWithQueryProp,
		addLoaderSuffix,
		moveOptionsToUse
	];
	transforms.forEach((t: Function): void => t());

	return ast;
}
