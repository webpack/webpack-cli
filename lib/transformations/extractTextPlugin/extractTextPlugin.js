const safeTraverse = require('../utils').safeTraverse;
const findPluginsByName = require('../utils').findPluginsByName;

module.exports = function(j, ast) {
    const changeArguments = function(p) {
		const args = p.value.arguments;
		// if(args.length === 1) {
		// 	return p;
		// } else 
		const literalArgs = args.filter(p => p.type === 'Literal');
		if (literalArgs && literalArgs.length > 1) {
			const newArgs = j.objectExpression(literalArgs.map((p, index) => 
				j.property('init',
					j.identifier(index === 0 ? 'fallback': 'use'),
					j.literal(p.value)
				)
			));
			p.value.arguments = [newArgs];
		}
		console.log(p.value.arguments);
        return p;
	};
	const name = getName(j, ast, 'extract-text-webpack-plugin');
	return ast.find(j.CallExpression)
        .filter(p => p.value.callee.object)
        .filter(p => p.value.callee.object.name === name)
        .forEach(changeArguments)
		.toSource({ quote: 'single' })
		//.forEach(p => console.log(p.toSource()));
	
	//return ast.toSource({ quote: 'single' });
};

const getName = function(j, ast, pkgName){
	return 'ExtractTextPlugin';
};


