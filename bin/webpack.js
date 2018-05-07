#!/usr/bin/env node

const spawn = require("cross-spawn");
const path = require("path");
const args = [path.join(__dirname, "_webpack")];

process.argv.slice(2).forEach(arg => {
	const normalizedArg = arg.replace("node.", "");
	if (arg.includes("node.")) {
		args.unshift(normalizedArg);
	} else {
		args.push(arg);
	}
});

const proc = spawn(process.execPath, args, {
	stdio: "inherit"
});

proc.on("exit", (code, signal) => {
	process.on("exit", () => {
		if (signal) {
			process.kill(process.pid, signal);
		} else {
			process.exit(code);
		}
	});
});

// terminate children.
process.on("SIGINT", () => {
	proc.kill("SIGINT");
	proc.kill("SIGTERM");
});

