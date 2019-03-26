import {
	AutoComplete,
	Confirm,
	IInquirerInput,
	Input,
	InputValidate,
	List,
} from "@webpack-cli/webpack-scaffold";
import { existsSync } from "fs";
import { resolve } from "path";
import {
	searchProps,
} from "../index";

/**
 * Returns Inquirer question for given action
 * @param action string
 */
export const manualOrListInput: (action: string) => IInquirerInput = (action: string) => {
	const actionQuestion = `What do you want to add to ${action}?`;
	return Input("actionAnswer", actionQuestion);
};

export const actionTypeQuestion = AutoComplete(
	"actionType",
	"What property do you want to add to?",
	{
		pageSize: 7,
		source: searchProps,
		suggestOnly: false,
	},
);

export const entryTypeQuestion = Confirm(
	"entryType",
	"Will your application have multiple bundles?",
	false,
);

export const topScopeQuestion = Input(
	"topScope",
	"What do you want to add to topScope?",
);

const mergeFileQuestionFunction = () => {
 const question = "What is the location of webpack configuration with which you want to merge current configuration?";
 const validator = (path: string) => {
		const resolvedPath = resolve(process.cwd(), path);
		if (existsSync(resolvedPath)) {
			if (/\.js$/.test(path)) {
				if (typeof require(resolvedPath) !== "object") {
					return "Given file doesn't export an Object";
				}
				return true;
			}
			return "Path doesn't corresponds to a javascript file";
		}
		return "Invalid path provided";
	};
 return InputValidate("mergeFile", question, validator);
};
export const mergeFileQuestion = mergeFileQuestionFunction();
