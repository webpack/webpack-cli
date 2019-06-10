import * as path from "path";
const prettyjson = require("prettyjson");
import chalk from "chalk";
export function fetchConfig() {
	const configPath = path.resolve(process.cwd() + "/" + "webpack.config.js");
	const config = require(configPath);
	return config;
}

export function configReader(config) {
	let filteredArray = [];
	console.log(config);
	var options = {
		noColor: true
	};
	console.log("\n\n------");
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
