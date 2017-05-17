const utils = require('../utils');

module.exports = function(j, ast) {
	/**
	 * Creates an array expression out of loaders string
	 * @param path
	 * @returns {*}
	 */
	const createArrayExpression = function(path) {
		let objs = utils.safeTraverse(path, ['parent', 'node', 'value', 'value'])
			.split('!')
			.map(val => j.objectExpression([
				utils.createProperty(j, 'loader', val)
			]));
		path.parent.node.value = j.arrayExpression(objs);
		return path;
	};

	const createLoaderWithQuery = p => {
		let properties = p.value.properties;
		let loaderValue = properties
			.reduce((val, prop) => prop.key.name === 'loader' ? prop.value.value : val, '');
		let loader = loaderValue.split('?')[0];
		let query = loaderValue.split('?')[1];
		let options = query.split('&').map(option => {
			const param = option.split('=');
			const key = param[0];
			const val = param[1] || true; // No value in query string means it is truthy value
			return j.objectProperty(j.identifier(key), utils.createLiteral(j, val));
		});
		let loaderProp = utils.createProperty(j, 'loader', loader);
		let queryProp = j.property('init', j.identifier('options'), j.objectExpression(options));
		return j.objectExpression([loaderProp, queryProp]);
	};

	const findLoaderWithQueryString = p => {
		return p.value.properties
			.reduce((predicate, prop) => {
				return utils.safeTraverse(prop, ['value', 'value', 'indexOf'])
					&& prop.value.value.indexOf('?') > -1
					|| predicate;
			}, false);
	};

	/**
	 * If the path value is `loaders` and it's located in `module` object
	 * we assume it's the loader's section
	 *
	 * @param path
	 */
	const checkForLoader = path => path.value.name === 'loaders' &&
		utils.safeTraverse(path, ['parent', 'parent', 'parent', 'node', 'key', 'name']) === 'module';

	/**
	 * Puts node path that is pre- or postLoader into `enforce` key
	 * @param p {Node}
	 * @returns {*}
	 */
	const fitIntoLoaders = p => {
		let loaders;
		p.value.properties.map(prop => {
			const keyName = prop.key.name;
			if (keyName === 'loaders') {
				loaders = prop.value;
			}
		});
		p.value.properties.map(prop => {
			const keyName = prop.key.name;
			if (keyName !== 'loaders') {
				const enforceVal = keyName === 'preLoaders' ? 'pre' : 'post';

				prop.value.elements.map(elem => {
					elem.properties.push(utils.createProperty(j, 'enforce', enforceVal));
					if (loaders && loaders.type === 'ArrayExpression') {
						loaders.elements.push(elem);
					} else {
						prop.key.name = 'loaders';
					}
				});
			}
		});
		if (loaders) {
			p.value.properties = p.value.properties.filter(prop => prop.key.name === 'loaders');
		}
		return p;
	};

	/**
	 * Find pre and postLoaders
	 */
	const prepostLoaders = () => ast
		.find(j.ObjectExpression)
		.filter(p => utils.findObjWithOneOfKeys(p, ['preLoaders', 'postLoaders']))
		.forEach(fitIntoLoaders);

	/**
	 * Convert top level `loaders` to `rules`
	 * See https://webpack.js.org/configuration/module/#module-rules
	 */
	const loadersToRules = () => ast
		.find(j.Identifier)
		.filter(checkForLoader)
		.forEach(p => p.value.name = 'rules');

	/**
	 * Convert `loaders` in the rules to `use`
	 * See https://webpack.js.org/configuration/module/#rule-use
	 */
	const loadersToUse = () => ast
		.find(j.Identifier)
		.filter(p => (p.value.name.startsWith('loader')) &&
			utils.safeTraverse(
				p,
				['parent', 'parent', 'parent', 'parent', 'node', 'key', 'name']
			) === 'rules'
		)
		.forEach(p => p.value.name = 'use');

	const loadersToArrayExpression = () => ast
		.find(j.Identifier)
		.filter(p => {
			return p.value.name === 'use'
				&& p.parent.node.value.type === 'Literal';
		})
		.forEach(createArrayExpression);

	/**
	 * Finds loaders with options encoded as query string and replaces it with options obejct
	 */
	const loaderWithQueryParam = () => ast
		.find(j.ObjectExpression)
		.filter(p => utils.findObjWithOneOfKeys(p, 'loader'))
		.filter(findLoaderWithQueryString)
		.replaceWith(createLoaderWithQuery);

	/**
	 * Finds nodes with `query` key and replaces it with `options`
	 */
	const loaderWithQueryProp = () => ast
		.find(j.Identifier)
		.filter(p => p.value.name === 'query')
		.replaceWith(j.identifier('options'));

	/**
	 * Adds required `-loader` suffix to loader with missing suffix
	 */
	const addLoaderSuffix = () => ast
		.find(j.ObjectExpression)
		.forEach(path => {
			path.value.properties.forEach(prop => {
				if (prop.key.name === 'loader'
					&& utils.safeTraverse(prop, ['value', 'value'])
					&& !prop.value.value.endsWith('-loader')) {
					prop.value = j.literal(prop.value.value + '-loader');
				}
			});
		});

	const transforms = [
		prepostLoaders,
		loadersToRules,
		loadersToUse,
		loadersToArrayExpression,
		loaderWithQueryParam,
		loaderWithQueryProp,
		addLoaderSuffix
	];
	transforms.forEach(t => t());

	return ast;
};
