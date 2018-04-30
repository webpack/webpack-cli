const spawn = require("cross-spawn");
const path = require("path");
/**
 * Lookup for prefixed arguments (node.)
 * place them before webpack cli arguments and spawns
 * a different process using these V8/Node flags.
 * By Doing that, user has the power to provide any node options, e.g --max-old-space-size=1024
 * and these are going to be correctly used.
 *
 * @param  {array} argv - Arguments input by the user directly to CLI
 * @returns {Void} void
 */
module.exports = function(argv) {
	const args = [path.join(__dirname, "webpack.js")];

	argv.slice(2).forEach((arg) => {
		if (arg.includes("node.")) {
			args.unshift(arg.replace("node.", ""));
		} else {
			args.push(arg);
		}
	});

	const webpackCliProcess = spawn(process.execPath, args, {
		stdio: "inherit",
	});

	webpackCliProcess.on("exit", (code, signal) => {
		process.on("exit", () => {
			if (signal) {
				process.kill(process.pid, signal);
			} else {
				process.exit(code);
			}
		});
	});

	/**
	 * Terminate children
	 * just in case the current one is terminated.
	 */
	process.on("SIGINT", () => {
		webpackCliProcess.kill("SIGINT");
		webpackCliProcess.kill("SIGTERM");
	});

};
