
const spawn = require("cross-spawn");
const path = require("path");
const args = [path.join(__dirname, "webpack")];

/**
 * Process arguments and spawns a node process applying node/v8 options
 * @param {array} argvs webpack-cli arguments
 * @returns {void}
 */
module.exports = (argvs) => {
	argvs.slice(2).forEach(arg => {
		const normalizedArg = arg.replace("node.", "");
		if (arg.includes("node.")) {
			args.unshift(normalizedArg);
		} else {
			args.push(arg);
		}
	});

	const webpackCliProcess = spawn(process.execPath, args, {
		stdio: "inherit"
	});

	webpackCliProcess.on("exit", (code, signal) => {
		if (signal) {
			process.kill(process.pid, signal);
		} else {
			process.exit(code);
		}
	});

	// when process was terminated ([Ctrl/Cmd]+C)
	process.on("SIGINT", () => {
		webpackCliProcess.kill("SIGINT");
		webpackCliProcess.kill("SIGTERM");
	});

	// when main process was exited.
	process.on("exit", (code) => {
		webpackCliProcess.kill("SIGINT");
	});
};
