const utils = require('../utils');

module.exports = function(j, ast) {

	const createArrayExpression = function(p) {
		let objs = p.parent.node.value.value.split('!')
			.map(val => j.objectExpression([
				utils.createProperty(j, 'loader', val)
			]));
		let loaderArray = j.arrayExpression(objs);
		p.parent.node.value = loaderArray;
		return p;
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
			return j.objectProperty(j.identifier(key), utils.createLiteral(val));
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

	const checkForLoader = p => p.value.name === 'loaders' && utils.safeTraverse(p,
		['parent', 'parent', 'parent', 'node', 'key', 'name']) === 'module';

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

	const prepostLoaders = () => ast
		.find(j.ObjectExpression)
		.filter(p => utils.findObjWithOneOfKeys(p, ['preLoaders', 'postLoaders']))
		.forEach(p => p = fitIntoLoaders(p));

	const loadersToRules = () => ast
		.find(j.Identifier)
		.filter(checkForLoader)
		.forEach(p => p.value.name = 'rules');

	const loaderToUse = () => ast
		.find(j.Identifier)
		.filter(p => {
			return (p.value.name === 'loaders' || p.value.name === 'loader')
				&& utils.safeTraverse(p,
					['parent', 'parent', 'parent', 'parent', 'node', 'key', 'name']) === 'rules';
		})
		.forEach(p => p.value.name = 'use');

	const loadersInArray = () => ast
		.find(j.Identifier)
		.filter(p => {
			return p.value.name === 'use'
				&& p.parent.node.value.type === 'Literal'
				&& p.parent.node.value.value.indexOf('!') > 0;
		})
		.forEach(createArrayExpression);

	const loaderWithQueryParam = () => ast
		.find(j.ObjectExpression)
		.filter(p => utils.findObjWithOneOfKeys(p, 'loader'))
		.filter(findLoaderWithQueryString)
		.replaceWith(createLoaderWithQuery);

	const loaderWithQueryProp = () => ast
		.find(j.Identifier)
		.filter(p => p.value.name === 'query')
		.replaceWith(j.identifier('options'));

	const addLoaderSuffix = () => ast
		.find(j.ObjectExpression)
		.forEach(path => {
			path.value.properties.forEach(prop => {
				if ((prop.key.name === 'loader' || prop.key.name === 'use')
					&& utils.safeTraverse(prop, ['value', 'value'])
					&& prop.value.value.indexOf('-loader') === -1) {
					prop.value = j.literal(prop.value.value + '-loader');
				}
			});
		})
		.toSource();

	const transforms = [
		prepostLoaders,
		loadersToRules,
		loaderToUse,
		loadersInArray,
		loaderWithQueryParam,
		loaderWithQueryProp,
		addLoaderSuffix
	];
	transforms.forEach(t => t());

	return ast;
};
