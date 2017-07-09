// @flow
/* eslint-disable node/no-unsupported-features */

export type Ijscodeshit = {
	literal: (literalVal: string | boolean | number) => INode,
	identifier: (literalVal: string | boolean | number) => INode,
	property: (propertyString: string, node: INode, objectExpression: INode) => any,
	memberExpression: (first: any, second: any) => any,
	MemberExpression: Object,
	CallExpression: Object,
	ObjectExpression: Object,
	Literal: {
		name: string
	},
	(): Ijscodeshit,
	find: () => any,
	filter: () => any,
	objectExpression: (options: INode[]) => INode,
	arrayExpression: () => any,
	Identifier: Object,
	ArrayExpression: Object,
	objectProperty: (node: INode, objectLiteral: Object) => Object,
};

export type IAst = {
	find: (memberToFind: any) => IAst,
	size: () => number,
	filter: (caller: (node: INode) => boolean) => IAst,
	forEach: (caller: (node: INode) => any | void) => IAst,
	replaceWith: (caller: ((node: INode) => any) | INode) => IAst
}

export type INode = {
	key: {
		name: string
	},
	value: {
		name: string,
		value: string,
		arguments: Object[],
		properties: Object[],
		elements: Object[]
	}
}

export type IPath = {

}
