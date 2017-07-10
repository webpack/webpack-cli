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
	Property: Object,
	VariableDeclarator: Object,
	(): Ijscodeshit,
	find: () => any,
	filter: () => any,
	objectExpression: (options: INode[]) => INode,
	arrayExpression: () => any,
	Identifier: Object,
	ArrayExpression: Object,
	Program: Object,
	remove: () => void,
	program: (paths: string[]) => INode,
	callExpression: () => INode,
	objectProperty: (node: INode, objectLiteral: Object) => Object,
};

export type IAst = {
	find: (memberToFind: any) => IAst,
	size: () => number,
	filter: (callback: (node: INode) => boolean) => IAst,
	forEach: (callback: (node: INode) => any | void) => IAst,
	replaceWith: (callback: ((node: INode) => any) | INode) => IAst
}

export type INode = {
	key: {
		name: string
	},
	value: {
		loc: {
			start: {
				line: number,
				column: number
			}
		},
		init: {
			arguments: Object[]
		},
		body: string,
		name: string,
		value: {
			type: string
		} | string,
		arguments: Object[],
		properties: Object[],
		elements: Object[]
	},
	parent: INode
}

export type IPath = {

}
