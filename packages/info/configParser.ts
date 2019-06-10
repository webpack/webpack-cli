import * as path from "path";
import chalk from "chalk";
const prettyjson = require("prettyjson");

export function getNameFromPath(fullPath: string): string {
	const filename = fullPath.replace(/^.*[\\\/]/, "");
	return filename;
}

export function resolveFilePath(relativeFilePath: string) {
	const configPath = path.resolve(process.cwd() + "/" + relativeFilePath);
	return configPath;
}

export function fetchConfig(configPath: string) {
	let config = null;
	config = require(configPath);
	try {
	} catch (e) {
		process.stdout.write(chalk.red(`Error:`, e.code) + "\n");
	}
	return config;
}

export function configReader(config) {
	let filteredArray = [];

	var options = {
		noColor: true
	};
	Object.keys(config).map(key => {
		let rowArray = [key];
		rowArray.push(prettyjson.render(config[key], options));
		filteredArray = [...filteredArray, rowArray];
	});
	return filteredArray;
}

function parseObject(inputObj: object) {
	let returnString = ``;
	Object.keys(inputObj).map(key => {
		if (Array.isArray(inputObj[key])) {
			returnString += stringifyArray(inputObj[key]);
		} else if (typeof inputObj[key] === "object") {
			returnString += prettyjson(inputObj[key]);
		} else {
			returnString += stringifyKeyPair(key, inputObj[key]);
		}
	});
	return returnString;
}

function stringifyKeyPair(key, value) {
	const returnString = key + ": " + value + "\n";
	return returnString;
}
function stringifyArray(inputArray) {
	let returnString = ``;
	inputArray.map(elm => {
		returnString += elm + "\n";
	});
	return returnString;
}

function parseAny(value) {
	return value;
}
