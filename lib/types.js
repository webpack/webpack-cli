// @flow
/* eslint-disable node/no-unsupported-features */

export type Ijscodeshit = {
	literal: (literalVal: string | boolean | number) => IPath<ILiteral>,
	identifier: (literalVal: string | boolean | number) => IPath<IIdentifier>,
	property: (name: string, key: any, assignee: any) => IProperty<*>,
	memberExpression: (first: any, second: any) => any,
	(): IPath<*>,
	// (node: IPath<*>): IPath<*>,
	objectExpression: (options: any[]) => IObjectExpression,
	arrayExpression: () => any,
	program: (paths: string[]) => IPath<*>,
	callExpression: () => IPath<ICallExpression>,
	objectProperty: (
		node: any,
		objectLiteral?: Object
	) => IPath<IObjectExpression>,
	filters: {
		VariableDeclarator: {
			requiresModule: (moduelToRequire: any) => () => void
		}
	},
	variableDeclaration: (
		declarationName: string,
		declaratino: any
	) => IPath<IVariableDeclarator>,
	variableDeclarator: (
		declarator: any,
		expression: any
	) => IPath<IVariableDeclarator>,
	newExpression: (rightExpression: any, leftExpressino: any) => IIdentifier,

	// primitives expressions
	NewExpression: Expression,
	MemberExpression: Expression,
	CallExpression: Expression,
	ObjectExpression: Expression,
	Literal: Expression,
	Property: Expression,
	VariableDeclarator: Expression,
	Identifier: Expression,
	ArrayExpression: Expression,
	Program: Expression
};

export type Expression = {
	name: string
};

export type IPath<NodeType> = {
	value: NodeType,
	parent: IPath<*>,
	node: NodeType,
	type: string,
	find: (memberToFind: Expression) => IPath<*>,
	size: () => number,
	filter: (callback: (node: IPath<*>) => any) => IPath<*>,
	forEach: (callback: (node: IPath<*>) => any | void) => IPath<*>,
	replaceWith: any => IPath<*>,
	toSource: (options?: Object) => IPath<*>,
	get: (property: string) => any,
	remove: (node: any) => void,
	nodes: () => any[]
};
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
};

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
};

/**
 * [ITokenType description]
 * @type {Object}
 */
export type ITokenType = {
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
};

export type ILiteral = {
	type: string,
	start: number,
	end: number,
	loc: ILoc,
	value: string,
	rawValue: string,
	raw: string,
	name: string
};

export type INewExpression = {
	arguments: any[]
};

export type IObjectExpression = {
	properties: any[],
	type: string,
	range: [number, number],
	loc: ILoc
};

export type IProperty<NodeType> = {
	type: string,
	key: IIdentifier,
	computed: boolean,
	kind: string,
	value: any, // any node
	loc: ILoc,
	value: NodeType
};

export type IIdentifier = {
	name: string,
	type: string,
	loc: ILoc,
	range: [number, number]
};

export type IArrayExpression = {
	elements: any[], // ILiteral[] | IObjectExpression[]
	value: any // any node
};

export type IMemberExpression = {
	type: string,
	computed: boolean,
	object: IIdentifier,
	property: IIdentifier,
	range: [number, number],
	loc: ILoc
};

export type IVariableDeclaration = {
	declaration: IVariableDeclarator[],
	type: string,
	kind: string,
	range: [number, number],
	loc: ILoc
};

export type IVariableDeclarator = {
	type: string,
	id: IIdentifier,
	init: any,
	range: [number, number],
	loc: ILoc
};

export type ICallExpression = {
	type: string,
	callee: IMemberExpression,
	arguments?: any[],
	range: [number, number],
	loc: ILoc
};
