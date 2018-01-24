const utils = require("../../utils/ast-utils");

/**
 *
 * Transform for loaders. Transforms pre- and postLoaders into enforce options,
 * moves loader configuration into rules array, transforms query strings and
 * props into loader options, and adds -loader suffix to loader names.
 *
 * @param {object} j — jscodeshift top-level import
 * @param {Collection} ast — jscodeshift Collection to transform
 * @returns {Collection} ast — jscodeshift Collection
 */

module.exports = function(j, ast) {
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
	 * @param  {NodePath} path — wrapped ast object expression
	 * @returns {NodePath} path
	 */

	const createArrayExpressionFromArray = function(path) {
		const value = path.value;
		// Find paths with `loaders` keys in the given Object
		const paths = value.properties.filter(prop =>
			prop.key.name.startsWith("loader")
		);
		// For each pair of key and value
		paths.forEach(pair => {
			// Replace 'loaders' Identifier with 'use'
			pair.key.name = "use";
			// If the value is an Array
			if (pair.value.type === j.ArrayExpression.name) {
				// replace its elements
				const pairValue = pair.value;
				pair.value = j.arrayExpression(
					pairValue.elements.map(arrElement => {
						// If items of the array are Strings
						if (arrElement.type === j.Literal.name) {
							// Replace with `{ loader: LOADER }` Object
							return j.objectExpression([
								utils.createProperty(j, "loader", arrElement.value)
							]);
						}
						// otherwise keep the existing element
						return arrElement;
					})
				);
				//	If the value is String of loaders like 'style!css'
			} else if (pair.value.type === j.Literal.name) {
				// Replace it with Array expression of loaders
				const literalValue = pair.value;
				pair.value = j.arrayExpression(
					literalValue.value.split("!").map(loader => {
						return j.objectExpression([
							utils.createProperty(j, "loader", loader)
						]);
					})
				);
			}
		});
		return path;
	};

	/**
	 *
	 * Puts query parameters from loader value into options object
	 *
	 * @param {NodePath} p — wrapped ast object expression node for loader object
	 * @returns {Node} objectExpression — An object expression containing the query paramters
	 */

	const createLoaderWithQuery = p => {
		let properties = p.value.properties;
		let loaderValue = properties.reduce(
			(val, prop) => (prop.key.name === "loader" ? prop.value.value : val),
			""
		);
		let loader = loaderValue.split("?")[0];
		let query = loaderValue.split("?")[1];
		let options = query.split("&").map(option => {
			const param = option.split("=");
			const key = param[0];
			const val = param[1] || true; // No value in query string means it is truthy value
			return j.objectProperty(j.identifier(key), utils.createLiteral(j, val));
		});
		let loaderProp = utils.createProperty(j, "loader", loader);
		let queryProp = j.property(
			"init",
			j.identifier("options"),
			j.objectExpression(options)
		);
		return j.objectExpression([loaderProp, queryProp]);
	};

	/**
	 *
	 * Determine whether a loader has a query string
	 *
	 * @param {NodePath} p — wrapped ast object expression node for loader object
	 * @returns {boolean} Whether the loader value contains a query string
	 */

	const findLoaderWithQueryString = p => {
		return p.value.properties.reduce((predicate, prop) => {
			return (
				(utils.safeTraverse(prop, ["value", "value", "indexOf"]) &&
					prop.value.value.indexOf("?") > -1) ||
				predicate
			);
		}, false);
	};

	/**
	 * Check if the identifier is the `loaders` prop in the `module` object.
	 * If the path value is `loaders` and it’s located in `module` object
	 * we assume it’s the loader's section.
	 *
	 * @param  {NodePath} path — wrapped ast identifier node
	 * @returns {boolean}
	 */

	const checkForLoader = path =>
		path.value.name === "loaders" &&
		utils.safeTraverse(path, [
			"parent",
			"parent",
			"parent",
			"node",
			"key",
			"name"
		]) === "module";

	/**
	 * Puts pre- or postLoader into `loaders` object and adds the appropriate `enforce` property
	 *
	 * @param {NodePath} p — wrapped ast object expression that has a key for either 'preLoaders' or 'postLoaders'
	 * @returns {NodePath} p
	 */

	const fitIntoLoaders = p => {
		let loaders;
		p.value.properties.map(prop => {
			const keyName = prop.key.name;
			if (keyName === "loaders") {
				loaders = prop.value;
			}
		});
		p.value.properties.map(prop => {
			const keyName = prop.key.name;
			if (keyName !== "loaders") {
				const enforceVal = keyName === "preLoaders" ? "pre" : "post";
				prop.value.elements.map(elem => {
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
			p.value.properties = p.value.properties.filter(
				prop => prop.key.name === "loaders"
			);
		}
		return p;
	};

	/**
	 * Find pre- and postLoaders in ast and put them into the `loaders` array
	 *
	 * @returns {Collection} jscodeshift Collection
	 */

	const prepostLoaders = () =>
		ast
			.find(j.ObjectExpression)
			.filter(p => utils.findObjWithOneOfKeys(p, ["preLoaders", "postLoaders"]))
			.forEach(fitIntoLoaders);

	/**
	 * Convert top level `loaders` to `rules`
	 *
	 * @returns {Collection} jscodeshift Collection
	 */

	const loadersToRules = () =>
		ast
			.find(j.Identifier)
			.filter(checkForLoader)
			.forEach(p => (p.value.name = "rules"));

	/**
	 * Convert `loader` and `loaders` to Array of {Rule.Use}
	 *
	 * @returns {Collection} jscodeshift Collection
	 */

	const loadersToArrayExpression = () =>
		ast
			.find(j.ObjectExpression)
			.filter(path => utils.findObjWithOneOfKeys(path, ["loader", "loaders"]))
			.filter(
				path =>
					utils.safeTraverse(path, [
						"parent",
						"parent",
						"node",
						"key",
						"name"
					]) === "rules"
			)
			.forEach(createArrayExpressionFromArray);

	/**
	 * Find loaders with options encoded as query string and replace it with options obejct
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
	 * @returns {Collection} jscodeshift Collection
	 */

	const loaderWithQueryParam = () =>
		ast
			.find(j.ObjectExpression)
			.filter(p => utils.findObjWithOneOfKeys(p, ["loader"]))
			.filter(findLoaderWithQueryString)
			.replaceWith(createLoaderWithQuery);

	/**
	 * Find nodes with `query` key and replace it with `options`
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
	 * @returns {Collection} jscodeshift Collection
	 */

	const loaderWithQueryProp = () =>
		ast
			.find(j.Identifier)
			.filter(p => p.value.name === "query")
			.replaceWith(j.identifier("options"));

	/**
	 * Add required `-loader` suffix to loader with missing suffix
	 * e.g. for `babel` it should generate `babel-loader`
	 * @returns {Collection} jscodeshift Collection
	 */

	const addLoaderSuffix = () =>
		ast.find(j.ObjectExpression).forEach(path => {
			path.value.properties.forEach(prop => {
				if (
					prop.key.name === "loader" &&
					utils.safeTraverse(prop, ["value", "value"]) &&
					!prop.value.value.endsWith("-loader")
				) {
					prop.value = j.literal(prop.value.value + "-loader");
				}
			});
		});

	const transforms = [
		prepostLoaders,
		loadersToRules,
		loadersToArrayExpression,
		loaderWithQueryParam,
		loaderWithQueryProp,
		addLoaderSuffix
	];
	transforms.forEach(t => t());

	return ast;
};
