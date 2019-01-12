const colors = {
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",
	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",
	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m",
};

class logger {
	constructor(title) {
		this.title;
		process.stdout.write(`${colors.Bright}${title} - ${colors.FgCyan}webpack-cli ${colors.Reset}\n`);
		return;
	}

	log(message) {
		const messages = message.split("\n");
		if (messages.length === 1) {
			process.stdout.write(`${colors.Bright} • ${colors.Reset}${messages[0]} \n`);
		} else {
			process.stdout.write(`${colors.Bright} • ${colors.Reset}${messages[0]} \n`);
			messages.splice(0,1);
			messages.forEach(message => {
				process.stdout.write(`   ${message}\n`);
			});
		}
	}

	info(message) {
		const messages = message.split("\n");
		if (messages.length === 1) {
			process.stdout.write(`${colors.Bright}${colors.FgCyan} i ${messages[0]} ${colors.Reset}\n`);
		} else {
			process.stdout.write(`${colors.Bright}${colors.FgCyan} i ${messages[0]} \n`);
			messages.splice(0,1);
			messages.forEach(message => {
				process.stdout.write(`   ${message}\n`);
			});
			process.stdout.write(`${colors.Reset}`);
		}
	}

	error(message) {
		const messages = message.split("\n");
		if (messages.length === 1) {
			process.stderr.write(`${colors.Bright}${colors.FgRed} \u2717 ${messages[0]} ${colors.Reset}\n`);
		} else {
			process.stderr.write(`${colors.Bright}${colors.FgRed} \u2717 ${messages[0]} \n`);
			messages.splice(0,1);
			messages.forEach(message => {
				process.stderr.write(`   ${message}\n`);
			});
			process.stderr.write(`${colors.Reset}`);
		}
	}

	warn(message) {
		const messages = message.split("\n");
		if (messages.length === 1) {
			process.stdout.write(`${colors.FgYellow}${colors.Bright} ⚠ ${messages[0]} ${colors.Reset}\n`);
		} else {
			process.stdout.write(`${colors.FgYellow}${colors.Bright} ⚠ ${messages[0]} \n`);
			messages.splice(0,1);
			messages.forEach(message => {
				process.stdout.write(`   ${message}\n`);
			});
			process.stdout.write(`${colors.Reset}`);
		}
	}

	success(message) {
		const messages = message.split("\n");
		if (messages.length === 1) {
			process.stdout.write(`${colors.FgGreen}${colors.Bright} \u2713 ${colors.FgGreen}${messages[0]} ${colors.Reset}\n`);
		} else {
			process.stdout.write(`${colors.FgGreen}${colors.Bright} \u2713 ${colors.FgGreen}${messages[0]} \n`);
			messages.splice(0,1);
			messages.forEach(message => {
				process.stdout.write(`   ${message}\n`);
			});
			process.stdout.write(`${colors.Reset}`);
		}
	}
}
module.exports = logger;
