"use strict";

const InputValidate = require("webpack-addons").InputValidate;
const validate = require("./validate");

/**
 *
 * Prompts for entry points, either if it has multiple or one entry
 *
 * @param {Object} self - A variable holding the instance of the prompting
 * @param {Object} answer - Previous answer from asking if the user wants single or multiple entries
 * @returns {Object} An Object that holds the answers given by the user, later used to scaffold
 */

module.exports = (self, answer) => {
	let entryIdentifiers;
	let result;
	if (answer["entryType"] === true) {
		result = self
			.prompt([
				InputValidate(
					"multipleEntries",
					"Type the names you want for your modules (entry files), separated by comma [example: 'app,vendor']",
					validate
				)
			])
			.then(multipleEntriesAnswer => {
				let webpackEntryPoint = {};
				entryIdentifiers = multipleEntriesAnswer["multipleEntries"].split(",");
				function forEachPromise(obj, fn) {
					return obj.reduce(function(promise, prop) {
						const trimmedProp = prop.trim();
						return promise.then(n => {
							if (n) {
								Object.keys(n).forEach(val => {
									if (
										n[val].charAt(0) !== "(" &&
										n[val].charAt(0) !== "[" &&
										n[val].indexOf("function") < 0 &&
										n[val].indexOf("path") < 0 &&
										n[val].indexOf("process") < 0
									) {
										n[val] = `"${n[val]}.js"`;
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
				return forEachPromise(entryIdentifiers, entryProp =>
					self.prompt([
						InputValidate(
							`${entryProp}`,
							`What is the location of "${entryProp}"? [example: "./src/${entryProp}"]`,
							validate
						)
					])
				).then(propAns => {
					Object.keys(propAns).forEach(val => {
						if (
							propAns[val].charAt(0) !== "(" &&
							propAns[val].charAt(0) !== "[" &&
							propAns[val].indexOf("function") < 0 &&
							propAns[val].indexOf("path") < 0 &&
							propAns[val].indexOf("process") < 0
						) {
							propAns[val] = `"${propAns[val]}.js"`;
						}
						webpackEntryPoint[val] = propAns[val];
					});
					return webpackEntryPoint;
				});
			});
	} else {
		result = self
			.prompt([
				InputValidate(
					"singularEntry",
					"Which module will be the first to enter the application? [example: './src/index']",
					validate
				)
			])
			.then(singularAnswer => `"${singularAnswer["singularEntry"]}"`);
	}
	return result;
};
