"use strict";
const c = require("ansi-colors");
module.exports = [
	{
		type: "input",
		name: "name",
		prefix: c.greenBright(">"),
		message: "Please Enter Your Scaffold Name (Dont keep Empty)",
		validate: (name) => {
			if (name === "") {
				return "Name cannot be left blank";
			}
			// Regular expression for valid npm package name
			if (!RegExp("^(?:@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$").test(name)) {
				return "Invalid name";
			}
			return true;
		}

	},
	{
		type: "input",
		name: "description",
		prefix: c.greenBright(">"),
		message: "Please Enter Your Scaffold Description for package.json file",
		default: "Simple Scaffold"
	},
	{
		type: "input",
		name: "main",
		prefix: c.greenBright(">"),
		message: "Please Enter Your Scaffold Main for package.json file",
		default: "index.js"
	},
	{
		type: "input",
		name: "github_repo",
		prefix: c.greenBright(">"),
		message: "Please Enter Your Scaffold Github Repo for package.json file",
		default: ""
	},
	{
		type: "input",
		prefix: c.greenBright(">"),
		name: "author",
		message: "Please Enter Your Scaffold author for package.json file",
		default: ""
	},
	{
		type: "input",
		name: "license",
		prefix: c.greenBright(">"),
		message: "Please Enter Your Scaffold license for package.json file",
		default: ""
	}
];
