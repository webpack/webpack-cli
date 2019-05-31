export interface Node extends Object {
	id?: {
		name: string;
	};
	callee?: Node;
	arguments?: Node[];
	body?: Node[];
	elements?: Node[];
	expression?: {
		left: {
			computed: boolean;
			object: Node;
			property: Node;
			type: string;
		};
		operator: string;
		right: Node;
		type: string;
		value?: string;
	};
	filter?: (p: (p: Node) => boolean) => Node;
	find?: (objectExpression: object, filterExpression?: object) => Node;
	forEach?: (p: (p: Node) => void) => Node;
	get?: (property: string) => Node;
	remove?: () => void;
	nodes?: () => Node[];
	pop?: () => Node;
	key?: {
		name: string;
		value: Node | string;
	};
	node?: Node;
	name?: string;
	object?: object;
	parent?: Node;
	properties?: Node[];
	property?: Node;
	prune?: Function;
	replaceWith?: (objectExpression: object) => Node;
	size?: () => number;
	type?: string;
	value?: Node | string | Node[];
	toSource?: (object: { quote?: string }) => string;
	source?: string;
	ast?: Node;
	rules?: ModuleRule[];

	declarations?: Node[];

	__paths?: Node[];
}

interface ModuleRule {
	loader?: string;
}

interface ExpressionObject {
	name?: string;
}

export interface JSCodeshift extends Object {
	(source?: Node | string): Node;
	withParser?: (parser: string) => JSCodeshift;
	identifier?: (key: string) => Node;
	literal?: (key: valueType) => Node;
	memberExpression?: (node1: Node, node2: Node, bool?: boolean) => Node;
	objectProperty?: (key: Node, property: valueType) => Node;
	objectExpression?: (properties: Node[]) => Node;
	newExpression?: (expression: Node, args: Node[]) => Node;
	callExpression?: (expression: Node, args: Node[]) => Node;
	variableDeclarator?: (key: Node, args: Node) => Node;
	variableDeclaration?: (key: string, args: Node[]) => Node;
	arrayExpression?: (args?: Node[]) => Node;
	property?: (type: string, key: Node, value: Node) => Node;
	program?: (nodes: Node[]) => Node;
	booleanLiteral?: (bool: boolean) => Node;
	Property?: ExpressionObject;
	NewExpression?: ExpressionObject;
	CallExpression?: ExpressionObject;
	VariableDeclarator?: ExpressionObject;
	Identifier?: ExpressionObject;
	Literal?: ExpressionObject;
	ArrayExpression?: ExpressionObject;
	MemberExpression?: ExpressionObject;
	FunctionExpression?: ExpressionObject;
	ObjectExpression?: ExpressionObject;
	BlockStatement?: ExpressionObject;
	Program?: ExpressionObject;
	filters?: {
		VariableDeclarator: {
			requiresModule: Function;
		};
	};
}

export type valueType = string[] | string | number | boolean | Node | null;
