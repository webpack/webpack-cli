
import * as c from "ansi-colors";
module.exports = [
	{
		message: "Please Enter Your Scaffold Name (Dont keep Empty)",
		name: "name",
		prefix: c.greenBright(">"),
		type: "input",
		validate: (name: string): string|boolean => {
			if (name === "") {
				return "Name cannot be left blank";
			}
			// Regular expression for valid npm package name
			const regexPatternToValidateName = "^(?:@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$";
			if (!RegExp(regexPatternToValidateName).test(name)) {
				return "Invalid name";
			}
			return true;
		},

	},
	{
		default: "Simple Scaffold",
		message: "Please Enter Your Scaffold Description for package.json file",
		name: "description",
		prefix: c.greenBright(">"),
		type: "input",
	},
	{
		default: "index.js",
		message: "Please Enter Your Scaffold Main for package.json file",
		name: "main",
		prefix: c.greenBright(">"),
		type: "input",
	},
	{
		default: "",
		message: "Please Enter Your Scaffold Github Repo for package.json file",
		name: "github_repo",
		prefix: c.greenBright(">"),
		type: "input",
	},
	{
		default: "",
		message: "Please Enter Your Scaffold author for package.json file",
		name: "author",
		prefix: c.greenBright(">"),
		type: "input",
	},
	{
		default: "",
		message: "Please Enter Your Scaffold license for package.json file",
		name: "license",
		prefix: c.greenBright(">"),
		type: "input",
	},
];
