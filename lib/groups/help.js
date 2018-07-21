class HelpGroup {
	run() {
		const chalk = require("chalk");
		const b = chalk.blue;
		const w = chalk.white;

		const title = chalk.bold.underline("webpack-CLI");
		const desc = "The build tool for webpack projects";
		const usage = "Usage: `webpack [...options] | <command>`";
		const header = `
        ---------------------------
        ---------------------------    ${title}
        ---------------------------
        ---------------------------    ${desc}
        ---------------------------
        ---------------------------    ${usage}
        ---------------------------
        ---------------------------
        `;
		console.log(header);
		return header;
	}
}

module.exports = HelpGroup;
