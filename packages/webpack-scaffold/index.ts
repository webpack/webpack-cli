import * as jscodeshift from "jscodeshift";

export interface IScaffoldBaseObject {
	type?: string;
	name: string;
	message: string;
	choices?: ((answers: Object) => string) | string[];
	default?: string | number | string[] | number[] | ((answers: Object) => (string | number | string[] | number[]));
	validate?: ((input: string) => boolean | string);
	when?: ((answers: Object) => boolean) | boolean;
	store?: boolean;
	filter?: (name: string) => string;
}

export interface IInquirerList extends IScaffoldBaseObject {
	choices?: string[];
}

export interface IInquirerInput extends IScaffoldBaseObject {
	validate?: (input: string) => string | boolean;
}

export function createArrowFunction(value: Function): string {
	return `() => '${value}'`;
}

export function createRegularFunction(value: Function): string {
	return `function () {\n return '${value}'\n}`;
}

export function createDynamicPromise(arrOrString: Function[] | string): string {
	if (Array.isArray(arrOrString)) {
		return (
			"() => new Promise((resolve) => resolve([" +
			arrOrString.map((func: Function) => {
				return "'" + func + "'";
			}) +
			"]))"
		);
	} else {
		return "() => new Promise((resolve) => resolve(" + "'" + arrOrString + "'" + "))";
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

export function List(name: string, message: string, choices: string[]): IInquirerList {
	return {
		choices,
		message,
		name,
		type: "list",
	};
}

export function RawList(name: string, message: string, choices: string[]): IInquirerList {
	return {
		choices,
		message,
		name,
		type: "rawlist",
	};
}

export function CheckList(name: string, message: string, choices: string[]): IInquirerList {
	return {
		choices,
		message,
		name,
		type: "checkbox",
	};
}

export function Input(name: string, message: string): IInquirerInput {
	return {
		message,
		name,
		type: "input",
	};
}

export function InputValidate(name: string, message: string, cb?: (input: string) => string | boolean): IInquirerInput {
	return {
		message,
		name,
		type: "input",
		validate: cb,
	};
}

export function Confirm(name: string, message: string): IScaffoldBaseObject {
	return {
		message,
		name,
		type: "confirm",
	};
}

export function AutoComplete(name: string, message: string, options: object = {}) {
	return Object.assign({
		message,
		name,
		type: "autocomplete",
	}, options);
}
