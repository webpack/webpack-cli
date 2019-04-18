import * as jscodeshift from "jscodeshift";

export interface InquirerScaffoldObject {
	type?: string;
	name: string;
	message: string;
	choices?: ((answers: Record<string, string>) => string) | string[];
	default?:
		| string
		| number
		| boolean
		| string[]
		| number[]
		| ((answers: Record<string, string>) => string | number | boolean | string[] | number[]);
	validate?: (input: string) => boolean | string;
	when?: ((answers: Record<string, string>) => boolean) | boolean;
	store?: boolean;
	filter?: (name: string) => string;
}

export interface InquirerList extends InquirerScaffoldObject {
	choices?: string[];
}

export interface InquirerInput extends InquirerScaffoldObject {
	validate?: (input: string) => string | boolean;
}

export function createArrowFunction(value: string): string {
	return `() => '${value}'`;
}

export function createRegularFunction(value: string): string {
	return `function () {\n return '${value}'\n}`;
}

export function createDynamicPromise(arrOrString: string[] | string): string {
	if (Array.isArray(arrOrString)) {
		return (
			"() => new Promise((resolve) => resolve([" +
			arrOrString.map(
				(func: string): string => {
					return "'" + func + "'";
				}
			) +
			"]))"
		);
	} else {
		return `() => new Promise((resolve) => resolve('${arrOrString}'))`;
	}
}

export function createAssetFilterFunction(value: string): string {
	return `function (assetFilename) {\n return assetFilename.endsWith('.${value}');\n}`;
}

export function createExternalFunction(regexp: string): string {
	return (
		"\n function (context, request, callback) {\n if (" +
		"/" +
		regexp +
		"/.test(request)){" +
		"\n" +
		"   return callback(null, 'commonjs' + request);\n}\n" +
		"callback();\n}"
	);
}

export function parseValue(regexp: string): string {
	return jscodeshift(regexp);
}

export function createRequire(val: string): string {
	return `const ${val} = require('${val}');`;
}

export function List(name: string, message: string, choices: string[]): InquirerList {
	return {
		choices,
		message,
		name,
		type: "list"
	};
}

export function RawList(name: string, message: string, choices: string[]): InquirerList {
	return {
		choices,
		message,
		name,
		type: "rawlist"
	};
}

export function CheckList(name: string, message: string, choices: string[]): InquirerList {
	return {
		choices,
		message,
		name,
		type: "checkbox"
	};
}

export function Input(name: string, message: string): InquirerInput {
	return {
		message,
		name,
		type: "input"
	};
}

export function InputValidate(name: string, message: string, cb?: (input: string) => string | boolean): InquirerInput {
	return {
		message,
		name,
		type: "input",
		validate: cb
	};
}

export function Confirm(name: string, message: string, defaultChoice: boolean = true): InquirerScaffoldObject {
	return {
		default: defaultChoice,
		message,
		name,
		type: "confirm"
	};
}

// TODO: to understand this type
// eslint-disable-next-line
export function AutoComplete(name: string, message: string, options: object = {}): any {
	return Object.assign(
		{
			message,
			name,
			type: "autocomplete"
		},
		options
	);
}
