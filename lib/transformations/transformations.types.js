// @flow
/* eslint-disable node/no-unsupported-features */

export type Ijscodeshit = {
	literal: (literalVal: string | boolean | number) => IAstNode,
	identifier: (literalVal: string | boolean | number) => IAstNode,
	property: (propertyString: string, node: IAstNode, objectExpression: IAstNode) => any,
	memberExpression: (first: any, second: any) => any,
	MemberExpression: IAstNode,
	CallExpression: IAstNode,
	ObjectExpression: IAstNode,
	Literal: ILiteral,
	Property: IAstNode,
	VariableDeclarator: IAstNode,
	(): Ijscodeshit,
	find: () => any,
	filter: () => any,
	objectExpression: (options: IAstNode[]) => IAstNode,
	arrayExpression: () => any,
	Identifier: IAstNode,
	ArrayExpression: IAstNode,
	Program: IAstNode,
	remove: () => void,
	program: (paths: string[]) => IAstNode,
	callExpression: () => IAstNode,
	objectProperty: (node: IAstNode, objectLiteral: Object) => IAstNode,
};

export type IPath<NodeType> = {
	value: NodeType,
	parent: IAstNode
}

export type IAstNode = {
	type: string,
	start: number,
	end: number,
	loc: ILoc,
	sourceType: string,
	tokens?: ITokenType[],
	program?: IAstNode,
	comments?: IAstNodeCommentLine[],
	expression?: IAstNode,
	operator?: string,
	left?: IAstNode,
	right?: IAstNode,
	value: IAstNode,
	arguments: IAstNode[],
	parent: IAstNode,
	name: string,
	find: (memberToFind: any) => IAstNode,
	size: () => number,
	filter: (callback: (node: IPath<*>) => boolean) => IAstNode,
	forEach: (callback: (node: IPath<*>) => any | void) => IAstNode,
	replaceWith: (callback: ((node: IPath<*>) => any) | IAstNode) => IAstNode
}

/**
 * [IAstNodeCommentLine description]
 * @type {Object}
 */
export type IAstNodeCommentLine = {
	type: string,
	value: string,
	start: number,
	end: number,
	loc: ILoc,
	rage: number[]
}

/**
 * [ILoc description]
 * @type {Object}
 */
type ILoc = {
	start: {
		line: number,
		column: number
	},
	end: {
		line: number,
		column: number
	}
}

/**
 * [ITokenType description]
 * @type {Object}
 */
type ITokenType = {
	loc: ILoc,
	end: number,
	start: number,
	type: {
		label: string,
		keyword: string,
		beforeExpr: boolean,
		startsExpr: boolean,
		rightAssociative: boolean,
		isLoop: boolean,
		isAssign: boolean,
		prefix: boolean,
		postfix: boolean,
		binop: any,
		updateContext: any
	}
}

export type ILiteral = {
	type: string,
	start: number,
	end: number,
	loc: ILoc,
	value: string,
	rawValue: string,
	raw: string,
	name: string
}

export type INewExpression =  {
	arguments: IAstNode[]
}

export type IObjectExpression = {
	properties: IProperty<*>[],
	type: string,
	range: number[],
	loc: ILoc
}

export type IProperty<NodeType> = {
	type: string,
	key: IIdentifier,
	computed: boolean,
	kind: string,
	value: IAstNode,
	loc: ILoc,
	value: NodeType
}

export type IIdentifier = {
	name: string,
	type: string,
	loc: ILoc,
	range: number[]
}

export type IArrayExpression = {
	elements: ILiteral[],
	value: IAstNode
}

export type IMemberExpression = {
	type: string,
	computed: boolean,
	object: IIdentifier,
	property: IIdentifier,
	range: number[],
	loc: ILoc
}
