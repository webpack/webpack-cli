const { prompt } = require('enquirer');
const { green } = require('colorette');
const runCommand = require('./run-command');
const getPackageManager = require('./get-package-manager');
const packageExists = require('./package-exists');
const logger = require('./logger');

/**
 *
 * @param packageName
 * @param preMessage Message to show before the question
 */
async function promptInstallation(packageName, preMessage) {
    const packageManager = getPackageManager();

    if (!packageManager) {
        logger.error("Can't find package manager");
        process.exit(2);
    }

    if (preMessage) {
        preMessage();
    }

    // yarn uses 'add' command, rest npm and pnpm both use 'install'
    const commandToBeRun = `${packageManager} ${[packageManager === 'yarn' ? 'add' : 'install', '-D', packageName].join(' ')}`;

    let installConfirm;

    try {
        ({ installConfirm } = await prompt([
            {
                type: 'confirm',
                name: 'installConfirm',
                message: `Would you like to install '${green(packageName)}' package? (That will run '${green(commandToBeRun)}')`,
                initial: 'Y',
                stdout: process.stderr,
            },
        ]));
    } catch (error) {
        logger.error(error);
        process.exit(2);
    }

    if (installConfirm) {
        try {
            await runCommand(commandToBeRun);
        } catch (error) {
            logger.error(error);
            process.exit(2);
        }

        return packageExists(packageName);
    }

    process.exit(2);
}

module.exports = promptInstallation;
