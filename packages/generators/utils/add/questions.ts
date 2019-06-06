import { existsSync } from "fs";
import { resolve } from "path";
import { Question } from "inquirer";
import { AutoComplete, Confirm, Input, InputValidate } from "@webpack-cli/webpack-scaffold";

import { searchProps } from "./index";

/**
 * Returns Inquirer question for given action
 * @param {string} action action for which question has to be prompted
 * @returns {Question} Question for given action
 */
export const manualOrListInput = (action: string): Question => {
	const actionQuestion = `What do you want to add to ${action}?`;
	return Input("actionAnswer", actionQuestion);
};

export const actionTypeQuestion = AutoComplete("actionType", "What property do you want to add to?", {
	pageSize: 7,
	source: searchProps,
	suggestOnly: false
});

export const entryTypeQuestion: Question = Confirm("entryType", "Will your application have multiple bundles?", false);

export const topScopeQuestion: Question = Input("topScope", "What do you want to add to topScope?");

const mergeFileQuestionsFunction = (): Question[] => {
	const mergePathQuestion =
		"What is the location of webpack configuration with which you want to merge current configuration?";
	const mergePathValidator = (path: string): boolean | string => {
		const resolvedPath = resolve(process.cwd(), path);
		if (existsSync(resolvedPath)) {
			if (/\.js$/.test(path)) {
				return true;
			}
			return "Path doesn't correspond to a javascript file";
		}
		return "Invalid path provided";
	};
	const mergeConfigNameQuestion = "What is the name by which you want to denote above configuration?";
	return [
		InputValidate("mergeFile", mergePathQuestion, mergePathValidator),
		Input("mergeConfigName", mergeConfigNameQuestion)
	];
};
export const mergeFileQuestion: Question[] = mergeFileQuestionsFunction();
