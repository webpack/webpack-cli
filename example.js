const chalk = require('chalk');
const stdin = process.stdin;
stdin.setEncoding("utf-8");

// Prompt user to input data in console.
const txt = chalk.bold.white("webpack interactive");
console.log(txt);
// When user input data and click enter key.
stdin.on("data", function(data) {
	// User input exit.
	if (data === "exit\n") {
        console.log("woo");
	} else {
	}
});
