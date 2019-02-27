"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const log = (message) => process.stdout.write(message);
const logError = (message) => process.stderr.write(message);
class Logger {
    constructor(input) {
        if (input) {
            if (typeof input === "string") {
                this.name = input;
            }
            else {
                if (!input.name || input.name === "") {
                    throw new Error("Name of the task was not passed");
                }
                this.name = input.name;
                if (input.start) {
                    this.start();
                }
            }
        }
        else {
            throw new Error("Name of the task was not passed");
        }
    }
    log(message) {
        message = this.build(message);
        message = ` ${chalk_1.default.bold("•")} ${message}`;
        log(message);
    }
    success(message) {
        message = this.build(message);
        message = chalk_1.default.green(` ${chalk_1.default.bold("\u2713")} ${message}`);
        log(message);
    }
    error(message) {
        message = this.build(message);
        message = chalk_1.default.red(` ${chalk_1.default.bold("\u2717")} ${message}`);
        logError(message);
    }
    warn(message) {
        message = this.build(message);
        message = chalk_1.default.yellowBright(` ${chalk_1.default.bold("⚠")} ${message}`);
        log(message);
    }
    info(message) {
        message = this.build(message);
        message = chalk_1.default.cyan(` ${chalk_1.default.bold("i")} ${message}`);
        log(message);
    }
    clrscr() {
        log("\x1Bc");
        this.start();
    }
    custom(symbol, message) {
        if (symbol.length !== 1) {
            throw new Error("Only single character can be passed as symbol to custom");
        }
        else {
            message = this.build(message);
            message = ` ${chalk_1.default.bold(symbol)} ${message}`;
            log(message);
        }
    }
    build(message) {
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
    start() {
        const message = `${chalk_1.default.bold(this.name)} - ${chalk_1.default.cyan("webpack-cli")}` + "\n";
        log(message);
    }
}
exports.Logger = Logger;
