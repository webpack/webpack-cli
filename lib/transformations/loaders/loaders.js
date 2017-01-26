const safeTraverse = require('../safeTraverse');

module.exports = function(j, ast) {

	const createArrayExpression = function(p) {
		let objs = p.parent.node.value.value.split('!')
			.map(val => j.objectExpression([
				j.property('init',
					j.identifier('loader'),
					j.literal(val)
				)
			]));
		let loaderArray = j.arrayExpression(objs);
		p.parent.node.value = loaderArray;
		return p;
	};

	const createLiteral = val => {
		let literalVal = val;
		// We'll need String to native type conversions
		if (typeof val === 'string') {
			// 'true' => true
			if (val === 'true') literalVal = true;
			// 'false' => false
			if (val === 'false') literalVal = false;
			// '1' => 1
			if (!isNaN(Number(val))) literalVal = Number(val);
		}
		return j.literal(literalVal);
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
			return j.objectProperty(j.identifier(key), createLiteral(val));
		});
		let loaderProp = j.property('init', j.identifier('loader'), j.literal(loader));
		let queryProp = j.property('init', j.identifier('options'), j.objectExpression(options));
		return j.objectExpression([loaderProp, queryProp]);
	};

	const findObjWithPrePostLoaders = p => {
		return p.value.properties
			.reduce((predicate, prop) => {
				const name = prop.key.name;
				return name === 'preLoaders'
					|| name === 'postLoaders'
					|| predicate;
			}, false);
	};
	const findObjWithLoaderProp = p => {
		return p.value.properties
			.reduce((predicate, prop) => {
				return prop.key.name === 'loader'
					|| predicate;
			}, false);
	};

	const findLoaderWithQueryString = p => {
		return p.value.properties
			.reduce((predicate, prop) => {
				return safeTraverse(prop, ['value', 'value', 'indexOf'])
					&& prop.value.value.indexOf('?') > -1
					|| predicate;
			}, false);
	};

	const checkForLoader = p => p.value.name === 'loaders' && safeTraverse(p,
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
					elem.properties.push(j.property('init',
						j.identifier('enforce'),
						j.literal(enforceVal)));
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
		.filter(findObjWithPrePostLoaders)
		.forEach(p => p = fitIntoLoaders(p));

	const loadersToRules = () => ast
		.find(j.Identifier)
		.filter(checkForLoader)
		.forEach(p => p.value.name = 'rules');

	const loaderToUse = () => ast
		.find(j.Identifier)
		.filter(p => {
			return (p.value.name === 'loaders' || p.value.name === 'loader')
				&& safeTraverse(p,
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
		.filter(findObjWithLoaderProp)
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
					&& safeTraverse(prop, ['value', 'value'])
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

	return ast.toSource({ quote: 'single' });
};
