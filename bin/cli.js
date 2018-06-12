#!/usr/bin/env node
const spawn = require("cross-spawn");
const path = require("path");
const chokidar = require("chokidar");
const yargs = require("yargs");
const args = [path.join(__dirname, "_cli")];

const spawnProcess = (args) => {
	return spawn(process.execPath, args, {
		stdio: "inherit"
	});
};

// filter for node options/v8 options and position them correctly
process.argv.slice(2).forEach(arg => {
	const normalizedArg = arg.replace("node.", "");
	if (arg.includes("node.")) {
		args.unshift(normalizedArg);
	} else {
		args.push(arg);
	}
});

let webpackCliProcess = spawnProcess(args);

let isWatchMode = false;
let configWatcher = null;
let configFiles = [];

yargs.parse(process.argv.slice(2), (err, argv, output) => {
	isWatchMode = argv.watch;
	configFiles = Array.isArray(argv.config) ? argv.config : [argv.config];
	configFiles = configFiles.map(path.resolve);
});

if (isWatchMode) {
	configWatcher = chokidar.watch(configFiles);
	configWatcher.on("change", () => {
		webpackCliProcess.kill();
		webpackCliProcess = spawnProcess(args);
	});
} else {
	webpackCliProcess.on("exit", (code, signal) => {
		process.on("exit", () => {
			if (signal) {
				process.kill(process.pid, signal);
			} else {
				process.exit(code);
			}
		});
	});
}

process.on("SIGINT", () => {
	configWatcher.close();
	webpackCliProcess.kill("SIGINT");
	webpackCliProcess.kill("SIGTERM");
});
