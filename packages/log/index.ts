import chalk from "chalk";

const log = (message: string) => process.stdout.write(message);
const logError = (message: string) => process.stderr.write(message);

export class Logger {
	public name: string;

	constructor(input: { name?: string, start?: boolean} | string) {
		if (input) {
			if (typeof input === "string") {
				this.name = input;
			} else {
				if (!input.name || input.name === "") {
					throw new Error("Name of the task was not passed");
				}
				this.name = input.name;
				if (input.start) {
					this.start();
				}
			}
		} else {
			throw new Error("Name of the task was not passed");
		}
	}

	public log(message: string) {
		message = this.build(message);
		message = ` ${chalk.bold("•")} ${message}`;
		log(message);
	}

	public success(message: string) {
		message = this.build(message);
		message = chalk.green(` ${chalk.bold("\u2713")} ${message}`);
		log(message);
	}

	public error(message: string) {
		message = this.build(message);
		message = chalk.red(` ${chalk.bold("\u2717")} ${message}`);
		logError(message);
	}

	public warn(message: string) {
		message = this.build(message);
		message = chalk.yellowBright(` ${chalk.bold("⚠")} ${message}`);
		log(message);
	}

	public info(message: string) {
		message = this.build(message);
		message = chalk.cyan(` ${chalk.bold("i")} ${message}`);
		log(message);
	}

	public clrscr() {
		log("\x1Bc");
		this.start();
	}

	public custom(symbol: string, message: string) {
		if (symbol.length !== 1) {
			throw new Error("Only single character can be passed as symbol to custom");
		} else {
			message = this.build(message);
			message = ` ${chalk.bold(symbol)} ${message}`;
			log(message);
		}
	}

	private build(message: string): string {
		const lines = message.split("\n");
		if (lines.length === 1) {
			return lines[0] + "\n";
		}
		message = lines[0] + "\n";

		for (let i = 1; i < lines.length; i++) {
			message += `   ${lines[i]}\n`;
		}
		return message;
	}

	private start() {
		const message: string = `${ chalk.bold(this.name) } - ${chalk.cyan("webpack-cli")}` + "\n";
		log(message);
	}
}
