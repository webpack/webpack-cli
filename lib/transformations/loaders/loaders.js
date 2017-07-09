// @flow
import type { Ijscodeshit, IPath , IObjectExpression, IProperty, IArrayExpression, ILiteral, IIdentifier } from '../../types'; // eslint-disable-line node/no-unsupported-features
const utils = require('../utils');

module.exports = function(j: Ijscodeshit, ast: IPath<*>): IPath<*> {
	/**
	 * Creates an Array expression out of loaders string
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
	 * @param path {Node} - Must be an ObjectExpression
	 * @returns {*}
	 */
	const createArrayExpressionFromArray = function(path: IPath<IObjectExpression>): IPath<*> {
		const value: IObjectExpression = path.value;
		// Find paths with `loaders` keys in the given Object
		const paths = value.properties.filter((prop: IProperty<*>) => prop.key.name.startsWith('loader'));
		// For each pair of key and value
		paths.forEach((pair: IProperty<*>) => {
			// Replace 'loaders' Identifier with 'use'
			pair.key.name = 'use';
			// If the value is an Array
			if (pair.value.type === j.ArrayExpression.name) {
				// replace its elements
				const pairValue: IArrayExpression = pair.value;
				pair.value = j.arrayExpression(
					pairValue.elements.map(arrElement => {
						// If items of the array are Strings
						if (arrElement.type === j.Literal.name) {
							// Replace with `{ loader: LOADER }` Object
							return j.objectExpression([
								utils.createProperty(j, 'loader', arrElement.value)
							]);
						}
						// otherwise keep the existing element
						return arrElement;
					})
				);
			//	If the value is String of loaders like 'style!css'
			} else if (pair.value.type === j.Literal.name) {
				// Replace it with Array expression of loaders
				const literalValue: ILiteral = pair.value;
				pair.value = j.arrayExpression(
					literalValue.value
						.split('!')
						.map(loader => {
							return j.objectExpression([
								utils.createProperty(j, 'loader', loader)
							]);
						})
				);
			}
		});
		return path;
	};

	const createLoaderWithQuery = (p: IPath<IObjectExpression>): IObjectExpression => {
		let properties = p.value.properties;
		let loaderValue = properties
			.reduce((val, prop) => prop.key.name === 'loader' ? prop.value.value : val, '');
		let loader = loaderValue.split('?')[0];
		let query = loaderValue.split('?')[1];
		let options: Object[] = query.split('&').map(option => {
			const param = option.split('=');
			const key = param[0];
			const val = param[1] || true; // No value in query string means it is truthy value
			return j.objectProperty(j.identifier(key), utils.createLiteral(j, val));
		});
		let loaderProp: IProperty<*> = utils.createProperty(j, 'loader', loader);
		let queryProp: IProperty<IObjectExpression> = j.property('init', j.identifier('options'), j.objectExpression(options));
		return j.objectExpression([loaderProp, queryProp]);
	};

	const findLoaderWithQueryString = (p: IPath<IObjectExpression>): boolean => {
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
	const fitIntoLoaders = (p: IPath<IObjectExpression>): IPath<IObjectExpression> => {
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
	const prepostLoaders = (): IPath<IObjectExpression> => ast
		.find(j.ObjectExpression)
		.filter(p => utils.findObjWithOneOfKeys(p, ['preLoaders', 'postLoaders']))
		.forEach(fitIntoLoaders);

	/**
	 * Convert top level `loaders` to `rules`
	 * See https://webpack.js.org/configuration/module/#module-rules
	 */
	const loadersToRules = (): IPath<IIdentifier> => ast
		.find(j.Identifier)
		.filter(checkForLoader)
		.forEach((p: IPath<ILiteral>) => p.value.name = 'rules');

	/**
	 * Converts 'loader' and 'loaders' to Array of {Rule.Use}
	 */
	const loadersToArrayExpression = (): IPath<IObjectExpression> => ast
		.find(j.ObjectExpression)
		.filter(path => utils.findObjWithOneOfKeys(path, ['loader', 'loaders']))
		.filter(path => utils.safeTraverse(
			path, ['parent', 'parent', 'node', 'key', 'name']) === 'rules')
		.forEach(createArrayExpressionFromArray);

	/**
	 * Finds loaders with options encoded as query string and replaces it with options obejct
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
	 */
	const loaderWithQueryParam = (): IPath<IObjectExpression> => ast
		.find(j.ObjectExpression)
		.filter(p => utils.findObjWithOneOfKeys(p, ['loader']))
		.filter(findLoaderWithQueryString)
		.replaceWith(createLoaderWithQuery);

	/**
	 * Finds nodes with `query` key and replaces it with `options`
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
	 */
	const loaderWithQueryProp = (): IPath<IIdentifier> => ast
		.find(j.Identifier)
		.filter(p => p.value.name === 'query')
		.replaceWith(j.identifier('options'));

	/**
	 * Adds required `-loader` suffix to loader with missing suffix
	 * i.e. for `babel` it should generate `babel-loader`
	 */
	const addLoaderSuffix = (): IPath<IObjectExpression> => ast
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
		loadersToArrayExpression,
		loaderWithQueryParam,
		loaderWithQueryProp,
		addLoaderSuffix
	];
	transforms.forEach(t => t());

	return ast;
};
