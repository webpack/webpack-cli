const { yellow, cyan } = require('colorette');
const logger = require('../utils/logger');
const { packageExists } = require('../utils/package-exists');
const { promptInstallation } = require('../utils/prompt-installation');

const packagePrefix = '@webpack-cli';

const run = async (name, ...args) => {
    const scopeName = packagePrefix + '/' + name;
    let pkgLoc = packageExists(scopeName);
    if (!pkgLoc) {
        try {
            pkgLoc = await promptInstallation(`${scopeName}`, () => {
                logger.error(`The command moved into a separate package: ${yellow(scopeName)}\n`);
            });
        } catch (err) {
            logger.error(`Action Interrupted, use ${cyan('webpack-cli help')} to see possible commands.`);
        }
    }
    return pkgLoc ? require(scopeName).default(...args) : null;
};

module.exports = run;
