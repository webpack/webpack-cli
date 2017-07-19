// @flow
/* eslint-disable node/no-unsupported-features */

export type Ijscodeshit = {
	literal: (literalVal: string | boolean | number) => IPath<*>,
	identifier: (literalVal: string | boolean | number) => IPath<*>,
	property: (name: string, key: any, assignee: IPath<*>) => 	IProperty<*>,
	memberExpression: (first: any, second: any) => any,
	MemberExpression: IAstNode,
	CallExpression: any,
	ObjectExpression: IPath<IAstNode>,
	Literal: ILiteral,
	Property: IProperty<*>,
	VariableDeclarator: IAstNode,
	(): IPath<*>,
	find: (memberToFind: IAstNode) => IPath<*>,
	filter: () => any,
	objectExpression: (options: any[]) => IPath<IObjectExpression>,
	arrayExpression: () => any,
	Identifier: IAstNode,
	ArrayExpression: IAstNode,
	Program: IAstNode,
	program: (paths: string[]) => IPath<*>,
	callExpression: () => IAstNode,
	objectProperty: (node: any, objectLiteral?: Object) => IPath<IObjectExpression>,
	NewExpression: INewExpression,
	filters: {
		VariableDeclarator: {
			requiresModule: (moduelToRequire: any) => () => void
		}
	}
};

export type IPath<NodeType> = {
	value: NodeType,
	parent: IAstNode,
	node: NodeType,
	find: (memberToFind: any) => IPath<*>,
	size: () => number,
	filter: (callback: (node: IPath<*>) => any) => IPath<*>,
	forEach: (callback: (node: IPath<*>) => any | void) => IPath<*>,
	replaceWith: (any) => IPath<*>,
	toSource: (options?: Object) => IAstNode,
	get: (property: string) => any,
	remove: (node: any) => void,
	nodes: () => any[]
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
	find: (memberToFind: any) => IPath<*>,
	size: () => number,
	filter: (callback: (node: IPath<*>) => boolean) => IPath<*>,
	forEach: (callback: (node: IPath<*>) => any | void) => IPath<*>,
	replaceWith: (callback: ((node: IPath<*>) => any) | IPath<*>) => IPath<*>,
	toSource: (options?: Object) => any
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
	arguments: any[]
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

export type IVariableDeclaration = {
	declaration: IVariableDeclarator[],
	type: string,
	kind: string,
	range: number[],
	loc: ILoc
}

export type IVariableDeclarator = {
	type: string,
	id: IIdentifier,
	init: any,
	range: number[],
	loc: ILoc
}
