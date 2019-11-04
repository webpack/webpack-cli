const { prompt } = require('inquirer');
const logger = require('../utils/logger');

class ExternalCommand {
    /**
     *
     * @param {String} command
     * @param {String[]} args
     * @returns {Promise<unknown>}
     */
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

            executedCommand.on('exit', code => {
                resolve();
            });
        });
    }

    /**
     *
     * @param {String} extName
     * @returns {string | boolean}
     */
    static validateEnv(extName) {
        let packageIsInstalled;
        try {
            const path = require('path');
            const pathForCmd = path.resolve(process.cwd(), 'node_modules', '@webpack-cli', extName);
            require.resolve(pathForCmd);
            packageIsInstalled = pathForCmd;
        } catch (err) {
            packageIsInstalled = false;
        }
        return packageIsInstalled;
    }

    /**
     *
     * @param {String} scopeName
     * @param {String} name
     * @returns {Promise<boolean | string>}
     */
    static async promptInstallation(scopeName, name) {
        const path = require('path');
        const fs = require('fs');
        const isYarn = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));

        const packageManager = isYarn ? 'yarn' : 'npm';
        const options = ['install', '-D', scopeName];

        if (isYarn) {
            options[0] = 'add';
        }

        const commandToBeRun = `${packageManager} ${options.join(' ')}`;
        logger.error(`The command moved into a separate package: ${name}`);
        const question = `Would you like to install ${name}? (That will run ${commandToBeRun})`;
        const answer = await prompt([
            {
                type: 'confirm',
                name: 'installConfirm',
                message: question,
                default: 'Y',
                choices: ['Yes', 'No', 'Y', 'N', 'y', 'n'],
            },
        ]);
        if (answer.installConfirm === true) {
            await ExternalCommand.runCommand(commandToBeRun);
            return ExternalCommand.validateEnv(name);
        }
        process.exitCode = -1;
    }

    /**
     *
     * @param {String} name
     * @param {any[]} args
     * @returns {Promise<null|*>}
     */
    static async run(name, ...args) {
        let pkgLoc = ExternalCommand.validateEnv(name);
        const scopeName = '@webpack-cli/' + name;
        if (!pkgLoc) {
            pkgLoc = await ExternalCommand.promptInstallation(scopeName, name);
        }
        if (typeof pkgLoc !== 'boolean') {
            // Serve needs to be checked for
            if (name === 'serve') {
                return pkgLoc ? require(pkgLoc).serve(args) : null;
            }
            return pkgLoc ? require(pkgLoc).default(args) : null;
        } else if (pkgLoc === false) {
            throw new Error();
        }
    }
}

module.exports = ExternalCommand;
