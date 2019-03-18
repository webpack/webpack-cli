import { InputValidate } from "@webpack-cli/webpack-scaffold";

import validate from "./validate";

interface IEntry extends IYeoman {
	usingDefaults?: boolean;
}

/**
 *
 * Prompts for entry points, either if it has multiple or one entry
 *
 * @param	{Object} self 	- A variable holding the instance of the prompting
 * @param	{Object} answer - Previous answer from asking if the user wants single or multiple entries
 * @returns	{Object} An Object that holds the answers given by the user, later used to scaffold
 */

export default function entry(self: IEntry, answer: {
	entryType: boolean;
}): Promise<{}> {
	let entryIdentifiers: string[];
	let result: Promise<{}>;
	if (answer.entryType) {
		result = self
			.prompt([
				InputValidate(
					"multipleEntries",
					"Type the names you want for your modules (entry files), separated by comma [example: app,vendor]",
					validate,
				),
			])
			.then((multipleEntriesAnswer: {
				multipleEntries: string,
			}) => {
				const webpackEntryPoint: object = {};
				entryIdentifiers = multipleEntriesAnswer.multipleEntries.split(",");

				function forEachPromise(entries: string[], fn: (entryProp: string) => Promise<{} | void>) {
					return entries.reduce((promise: Promise<{}>, prop: string) => {
						const trimmedProp: string = prop.trim();

						return promise.then((n: object) => {
							if (n) {
								Object.keys(n).forEach((val: string): void => {
									if (
										n[val].charAt(0) !== "(" &&
										n[val].charAt(0) !== "[" &&
										!n[val].includes("function") &&
										!n[val].includes("path") &&
										!n[val].includes("process")
									) {
										n[val] = `\'${n[val].replace(/"|'/g, "").concat(".js")}\'`;
									}
									webpackEntryPoint[val] = n[val];
								});
							} else {
								n = {};
							}
							return fn(trimmedProp);
						});
					}, Promise.resolve());
				}
				return forEachPromise(entryIdentifiers, (entryProp: string): Promise<{} | void> =>
					self.prompt([
						InputValidate(
							`${entryProp}`,
							`What is the location of "${entryProp}"? [example: ./src/${entryProp}]`,
							validate,
						),
					]),
				).then((entryPropAnswer: object): object => {
					Object.keys(entryPropAnswer).forEach((val: string): void => {
						if (
							entryPropAnswer[val].charAt(0) !== "(" &&
							entryPropAnswer[val].charAt(0) !== "[" &&
							!entryPropAnswer[val].includes("function") &&
							!entryPropAnswer[val].includes("path") &&
							!entryPropAnswer[val].includes("process")
						) {
							entryPropAnswer[val] = `\'${entryPropAnswer[val].replace(/"|'/g, "")}\'`;
						}
						webpackEntryPoint[val] = entryPropAnswer[val];
					});
					return webpackEntryPoint;
				});
			});
	} else {
		result = self
			.prompt([
				InputValidate(
					"singularEntry",
					"Which will be your application entry point? (src/index)",
				),
			])
			.then((singularEntryAnswer: {
				singularEntry: string,
			}): string => {
				let { singularEntry } = singularEntryAnswer;
				singularEntry = `\'${singularEntry.replace(/"|'/g, "")}\'`;
				if (singularEntry.length <= 0) {
					self.usingDefaults = true;
				}
				return singularEntry;
			});
	}
	return result;
}
