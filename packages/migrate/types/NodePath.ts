export interface INode extends Object {
	id?: {
		name: string;
	};
	arguments?: INode[];
	body?: INode[];
	elements?: INode[];
	expression?: {
		left: {
			computed: boolean,
			object: INode,
			property: INode,
			type: string,
		},
		operator: string,
		right: INode,
		type: string,
	};
	filter?: (p: (p: INode) => boolean) => INode;
	find?: (objectExpression: object, filterExpression?: object) => INode;
	forEach?: (p: (p: INode) => void) => INode;
	get?: (property: string) => INode;
	remove?: (_?: void) => void;
	nodes?: (_?: void) => INode[];
	pop?: (_?: void) => INode;
	key?: {
		name: string;
		value: INode | string;
	};
	node?: INode;
	name?: string;
	object?: object;
	parent?: INode;
	properties?: INode[];
	property?: INode;
	prune?: Function;
	replaceWith?: (objectExpression: object) => INode;
	size?: (_?: void) => number;
	type?: string;
	value?: INode | string | any;
	toSource?: (object: {
		quote?: string,
	}) => string;
	source?: string;
	ast?: INode;
	rules?: IModuleRule[];
	__paths?: INode[];
}

interface IModuleRule {
	loader?: string;
}

interface IExpressionObject {
	name?: string;
}

export interface IJSCodeshift extends Object {
	(source?: INode | string): INode;
	withParser?: (parser: string) => IJSCodeshift;
	identifier?: (key: string) => INode;
	literal?: (key: valueType) => INode;
	memberExpression?: (node1: INode, node2: INode, bool?: boolean) => INode;
	objectProperty?: (key: INode, property: valueType) => INode;
	objectExpression?: (properties: INode[]) => INode;
	newExpression?: (expression: INode, args: INode[]) => INode;
	callExpression?: (expression: INode, args: INode[]) => INode;
	variableDeclarator?: (key: INode, args: INode) => INode;
	variableDeclaration?: (key: string, args: INode[]) => INode;
	arrayExpression?: (args?: INode[]) => INode;
	property?: (type: string, key: INode, value: INode) => INode;
	program?: (nodes: INode[]) => INode;
	booleanLiteral?: (bool: boolean) => INode;
	Property?: IExpressionObject;
	NewExpression?: IExpressionObject;
	CallExpression?: IExpressionObject;
	VariableDeclarator?: IExpressionObject;
	Identifier?: IExpressionObject;
	Literal?: IExpressionObject;
	ArrayExpression?: IExpressionObject;
	MemberExpression?: IExpressionObject;
	FunctionExpression?: IExpressionObject;
	ObjectExpression?: IExpressionObject;
	BlockStatement?: IExpressionObject;
	Program?: IExpressionObject;
	filters?: {
		VariableDeclarator: {
			requiresModule: Function,
		},
	};
}

export type valueType = string | number | boolean | any[] | INode | null;
