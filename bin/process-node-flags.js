// const { spawn } = require("child_process");
const spawn = require("cross-spawn");

module.exports = function(argv) {
	const args = [require.resolve("webpack-cli")];

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

	// Terminate children
	// just in case the current one is terminated.
	process.on("SIGINT", () => {
		webpackCliProcess.kill("SIGINT");
		webpackCliProcess.kill("SIGTERM");
	});

};
