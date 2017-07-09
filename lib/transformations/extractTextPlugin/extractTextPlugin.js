// @flow
import type { Ijscodeshit, IPath, INewExpression, IObjectExpression, IMemberExpression, ILiteral, ICallExpression } from '../../types'; // eslint-disable-line node/no-unsupported-features
const utils = require('../utils');

function findInvocation(j: Ijscodeshit, node: IPath<IMemberExpression>, pluginName: string): boolean {
	let found: boolean = false;
	found = j(node)
		.find(j.MemberExpression)
		.filter(p => p.get('object').value.name === pluginName).size() > 0;
	return !!found;
}

module.exports = function(j: Ijscodeshit, ast: IPath<*>) {
	const changeArguments = function(p: IPath<INewExpression>) {
		const args: any[] = p.value.arguments;
		// if(args.length === 1) {
		// 	return p;
		// } else
		const literalArgs: IPath<ILiteral>[] = args.filter(p => utils.isType(p, 'Literal'));
		if (literalArgs && literalArgs.length > 1) {
			const newArgs: IObjectExpression = j.objectExpression(
				literalArgs.map((p: IPath<ILiteral>, index: number) =>
					utils.createProperty(j, index === 0 ? 'fallback': 'use', p.value)
				)
			);
			p.value.arguments = [newArgs];
		}
		return p;
	};
	const name: ?string = utils.findVariableToPlugin(j, ast, 'extract-text-webpack-plugin');
	if(!name) return ast;
	const astFound: IPath<ICallExpression> = ast.find(j.CallExpression);
	if (astFound.size() > 0) {
		return astFound
			.filter((p: IPath<IMemberExpression>) => findInvocation(j, p, name))
			.forEach(changeArguments);
	}
	return ast;
};
