const chalk = require("chalk");

class HelpGroup {
	b() {
		const b = chalk.blue;
	}

	l() {
		const c = chalk.cyan;
	}
	run() {
		const b = s => chalk.blue(s);
		const l = s => chalk.white(s);
		const o = s => chalk.keyword("orange")(s);

		const commandLineUsage = require("command-line-usage");
		const options = require("../utils/cli-flags");
		const title =
			chalk.white.bold("⬡                     ") +
			chalk.white.underline("webpack") +
			chalk.white.bold("                     ⬡");
		const desc = "The build tool for modern web applications";
		const websitelink = "         " + chalk.white.underline("https://webpack.js.org");

		const usage = chalk.white.bold("Usage") + ": " + "`" + o("webpack [...options] | <command>") + "`";
		const examples = chalk.white.bold("Example") + ": " + "`" + o("webpack help --flag | <command>") + "`";

		const hh = `          ${title}\n
		${websitelink}\n
		${desc}\n
		${usage}\n
		${examples}\n
`;
		const sections = commandLineUsage([
			{
				content: hh,
				raw: true
			},
			{
				header: "Available Commands",
				content: options.commands.map(e => {
					return { name: e.name, summary: e.description };
				})
			},
			{
				header: "Options",
				optionList: options.core
			}
		]);
		return {
			outputOptions: {
				help: sections
			}
		};
	}
}

module.exports = HelpGroup;
