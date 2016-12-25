import safeTraverse from '../safeTraverse';

module.exports = function(fileInfo, api) {
	const j = api.jscodeshift;
	const ast = j(fileInfo.source);

	const createArrayExpression = function(p) {
		var objs = p.parent.node.value.value.split('!').map(val => j.objectExpression([j.property('init', 
										j.identifier('loader'), 
										j.literal(val)
										)]));
		var loaderArray = j.arrayExpression(objs);
		p.parent.node.value = loaderArray;
		return p;
	};

	const createLiteral = val => {
		var literalVal = val;
		if(val === 'true') literalVal = true;
		if(val === 'false') literalVal = false;
		return j.literal(literalVal);
	};

	const createLoaderWithQuery = p => {
		var properties = p.value.properties;
		var loaderValue = properties.reduce((val, prop) => prop.key.name === 'loader' ? prop.value.value : val, '');
		var loader = loaderValue.split('?')[0];
		var query = loaderValue.split('?')[1];
		var options = query.split('&').map(option => 
        j.objectProperty(j.identifier(option.split('=')[0]),createLiteral(option.split('=')[1]))
    );
		var loaderProp = j.property('init', j.identifier('loader'), j.literal(loader));
		var queryProp = j.property('init', j.identifier('options'), j.objectExpression(options));
		return j.objectExpression([loaderProp, queryProp]);
	};

	const findObjWithPrePostLoaders = p => {
		return p.value.properties.reduce((predicate, prop) => prop.key.name === 'preLoaders' || prop.key.name === 'postLoaders' || predicate , false);
	};
	const findObjWithLoaderProp = p => {
		return p.value.properties.reduce((predicate, prop) => prop.key.name === 'loader' || predicate , false);
	};

	const findLoaderWithQueryString = p => {
		return p.value.properties.reduce((predicate, prop) => safeTraverse(prop, ['value', 'value', 'indexOf']) && prop.value.value.indexOf('?') > -1 || predicate, false);
	};
	
	const checkForLoader = p => p.value.name === 'loaders' && safeTraverse(p, ['parent', 'parent', 'parent', 'node', 'key', 'name']) === 'module';

	const fitIntoLoaders = p => {
		let loaders;
		p.value.properties.map(prop => {
			const keyName = prop.key.name;
			if(keyName === 'loaders') {
				loaders = prop.value; 
			}
		});
		p.value.properties.map(prop => {
			const keyName = prop.key.name;
			if(keyName !== 'loaders'){
				const enforceVal = keyName === 'preLoaders' ? 'pre' : 'post';
        
				prop.value.elements.map(elem => {
					elem.properties.push( j.property( 'init', j.identifier('enforce'), j.literal(enforceVal) ) );
					if(loaders && loaders.type === 'ArrayExpression') {
						loaders.elements.push(elem);
					} else {
						prop.key.name = 'loaders';
					}
				});
			}
		});
		if(loaders){
			p.value.properties = p.value.properties.filter(prop => prop.key.name === 'loaders');
		}
		return p;
	};
  
	const prepostLoaders = () => ast
    .find(j.ObjectExpression)
    .filter(findObjWithPrePostLoaders)
    .forEach(p => p = fitIntoLoaders(p))

	const loadersToRules = () => ast
    .find(j.Identifier)
    .filter(checkForLoader)
    .forEach(p => p.value.name = 'rules')

	const loaderToUse = () => ast
    .find(j.Identifier)
    .filter(p => (p.value.name === 'loaders' || p.value.name === 'loader') && safeTraverse(p, ['parent', 'parent', 'parent', 'parent', 'node', 'key', 'name']) === 'rules')
    .forEach(p => p.value.name = 'use');


	const loadersInArray = () => ast
    .find(j.Identifier)
    .filter(p => p.value.name === 'use' && p.parent.node.value.type === 'Literal' && p.parent.node.value.value.indexOf('!') > 0)
    .forEach(createArrayExpression);

	const loaderWithQueryParam = () => ast
    .find(j.ObjectExpression)
    .filter(findObjWithLoaderProp)
    .filter(findLoaderWithQueryString)
    .replaceWith(createLoaderWithQuery);

	const loaderWithQueryProp = () => ast.find(j.Identifier)
    .filter(p => p.value.name === 'query')  
    .replaceWith(j.identifier('options'));

	const transforms = [ prepostLoaders, loadersToRules, loaderToUse, loadersInArray, loaderWithQueryParam, loaderWithQueryProp];
	transforms.forEach(t => t());

	return ast.toSource({quote:'single'});
};