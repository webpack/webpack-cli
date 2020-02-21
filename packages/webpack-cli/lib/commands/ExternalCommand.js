const { prompt } = require('enquirer');
const chalk = require('chalk');
const logger = require('../utils/logger');
const execa = require('execa');
const { packageExists, promptInstallation } = require('@webpack-cli/package-utils');

const packagePrefix = '@webpack-cli';

class ExternalCommand {
    static async runCommand(command, args = []) {
        const executedCommand = await execa(command, args, {
            stdio: 'inherit',
            shell: true,
        });
        return new Promise((resolve, reject) => {
            executedCommand.on('error', error => {
                reject(error);
            });

            executedCommand.on('exit', () => {
                resolve();
            });
        });
    }

    static async run(name, ...args) {
        let pkgLoc = packageExists(name);
        const scopeName = packagePrefix + '/' + name;
        if (!pkgLoc) {
            pkgLoc = await promptInstallation(`${scopeName + '/' + name}`, () => {
                logger.error(`The command moved into a separate package: ${chalk.keyword('orange')(packageName)}\n`);
            });
        }
        return pkgLoc ? require(scopeName).default(...args) : null;
    }
}

module.exports = ExternalCommand;
