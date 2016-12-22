import safeTraverse from '../safeTraverse';

module.exports = function(fileInfo, api) {
	const j = api.jscodeshift;
	const ast = j(fileInfo.source);
	const createArrayExpression = function(p) {
		//p.parent.node.value.value.split('!').map(item => console.log(item));
		var objs = p.parent.node.value.value.split('!')
    .map(val => j.objectExpression([j.property('init', 
										j.identifier('loader'), 
										j.literal(val)
										)])
    );
    
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
		//console.log(query);
		var options = query.split('&').map(option => j.property('init', j.identifier(option.split('=')[0]), createLiteral(option.split('=')[1])));
		var loaderProp = j.property('init', j.identifier('loader'), j.literal(loader));
		var queryProp = j.property('init', j.identifier('options'), j.objectExpression(options));
		return j.objectExpression([loaderProp, queryProp]);
	};
	const findObjWithLoaderProp = p => {
		return p.value.properties.reduce((predicate, prop) => prop.key.name === 'loader' || predicate , false);
	};
	const findLoaderWithQueryString = p => {
		return p.value.properties.reduce((predicate, prop) => safeTraverse(prop, ['value', 'value']) && prop.value.value.indexOf('?') > -1 || predicate, false);
	};
	const loadersToRules = () => ast
    .find(j.Identifier)
    .filter(p => p.value.name === 'loaders' && safeTraverse(p, ['parent', 'parent', 'parent', 'node', 'key', 'name']) === 'module')
    .forEach(p => p.value.name = 'rules')
    .toSource();
	const loaderToUse = () => ast
    .find(j.Identifier)
    .filter(p => (p.value.name === 'loaders' || p.value.name === 'loader') && safeTraverse(p, ['parent', 'parent', 'parent', 'parent', 'node', 'key', 'name']) === 'rules')
    .forEach(p => p.value.name = 'use')
    //.forEach(p => console.log(p.parent.node.value.elements[0].properties[0].key))
    .toSource();
	const loadersInArray = () => ast
    .find(j.Identifier)
    .filter(p => p.value.name === 'use' && p.parent.node.value.type === 'Literal' && p.parent.node.value.value.indexOf('!') > 0)
    .forEach(createArrayExpression)
    .toSource();
	const loaderWithQueryParam = () => ast
    .find(j.ObjectExpression)
    .filter(findObjWithLoaderProp)
    .filter(findLoaderWithQueryString)
    .replaceWith(createLoaderWithQuery)
    .toSource();
	const loaderWithQueryProp = () => ast.find(j.Identifier)
    .filter(p => p.value.name === 'query')  
    .replaceWith(j.identifier('options'))
    .toSource();
	const transforms = [ loadersToRules, loaderToUse, loadersInArray, loaderWithQueryParam, loaderWithQueryProp];
	transforms.forEach(t => t());
	return ast.toSource({quote:'single'});
};



