const { prompt } = require('inquirer');
const chalk = require('chalk');
const logger = require('../utils/logger');

const packagePrefix = '@webpack-cli';

class ExternalCommand {
    static async runCommand(command, args = []) {
        const cp = require('child_process');
        const executedCommand = await cp.spawn(command, args, {
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

    static checkIfPackageExists(extName) {
        try {
            const path = require('path');
            const pathForCmd = path.resolve(process.cwd(), 'node_modules', packagePrefix, extName);
            require.resolve(pathForCmd);
            return pathForCmd;
        } catch (err) {
            return false;
        }
    }
    static async promptInstallation(packageName, name) {
        const path = require('path');
        const fs = require('fs');
        const isYarn = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
        const packageManager = isYarn ? 'yarn' : 'npm';
        const options = [isYarn ? 'add' : 'install', '-D', packageName];

        const commandToBeRun = `${packageManager} ${options.join(' ')}`;
        logger.error(`The command moved into a separate package: ${chalk.keyword('orange')(packageName)}\n`);
        const question = `Would you like to install ${name}? (That will run ${chalk.green(commandToBeRun)})`;
        const { installConfirm } = await prompt([
            {
                type: 'confirm',
                name: 'installConfirm',
                message: question,
                default: 'Y',
                choices: ['Yes', 'No', 'Y', 'N', 'y', 'n'],
            },
        ]);
        if (installConfirm) {
            await ExternalCommand.runCommand(commandToBeRun);
            return ExternalCommand.checkIfPackageExists(name);
        }
        // eslint-disable-next-line require-atomic-updates
        process.exitCode = -1;
    }

    static async run(name, ...args) {
        let pkgLoc = ExternalCommand.checkIfPackageExists(name);
        const scopeName = packagePrefix + '/' + name;
        if (!pkgLoc) {
            pkgLoc = await ExternalCommand.promptInstallation(scopeName, name);
        }
        return pkgLoc ? require(pkgLoc).default(...args) : null;
    }
}

module.exports = ExternalCommand;
