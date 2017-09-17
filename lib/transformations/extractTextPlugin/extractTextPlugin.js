// @flow
// eslint-disable-next-line node/no-unsupported-features
import type {
	Ijscodeshit,
	IPath,
	INewExpression,
	IObjectExpression,
	IMemberExpression,
	ILiteral
} from "../../types";

const utils = require("../utils");

function findInvocation(j: Ijscodeshit, node: IPath<IMemberExpression>, pluginName: string): boolean {
	let found: boolean = false;
	found = j(node)
		.find(j.MemberExpression)
		.filter(p => p.get("object").value.name === pluginName).size() > 0;
	return found;
}

module.exports = function(j: Ijscodeshit, ast: IPath<*>): IPath<*> {
	const changeArguments = function(p: IPath<INewExpression>) {
		const args: any[] = p.value.arguments;
		// if(args.length === 1) {
		// 	return p;
		// } else
		const literalArgs: IPath<ILiteral>[] = args.filter(p => utils.isType(p, "Literal"));
		if (literalArgs && literalArgs.length > 1) {
			const newArgs: IObjectExpression = j.objectExpression(
				literalArgs.map((p: IPath<ILiteral>, index: number) =>
					utils.createProperty(j, index === 0 ? "fallback" : "use", p.value)
				)
			);
			p.value.arguments = [newArgs];
		}
		return p;
	};
	const name: ?string = utils.findVariableToPlugin(j, ast, "extract-text-webpack-plugin");
	if (!name) return ast;

	return ast.find(j.CallExpression)
		.filter((p: IPath<IMemberExpression>) => findInvocation(j, p, name))
		.forEach(changeArguments);
};
