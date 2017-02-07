const safeTraverse = require('../utils').safeTraverse;
const findPluginsByName = require('../utils').findPluginsByName;

module.exports = function(j, ast) {
    const changeArguments = function(p) {
		// const args = p.value.arguments;
		// if(args.length === 1) {
		// 	return p;
		// } else if(args.length === 2) {
		// 	if (args.filter(p => p.type === 'Literal').length == 2){
		// 		const newArgs = j.objectExpression(args.map((p, index) => [
		// 			j.property('init',
        //                 j.identifier(index === 0 ? 'fallback': 'use'),
        //                 j.literal(p.value)
        //             )
		// 		]));
		// 		console.log(newArgs);
		// 	}
		// }
        return p;
	};
	const name = getName(j, ast, 'extract-text-webpack-plugin');
	ast.find(j.CallExpression)
        .filter(p => p.value.callee.object)
        .filter(p => p.value.callee.object.name === name)
        .forEach(changeArguments);
	
	return ast.toSource({ quote: 'single' });
};

const getName = function(j, ast, pkgName){
	return 'ExtractTextPlugin';
};


