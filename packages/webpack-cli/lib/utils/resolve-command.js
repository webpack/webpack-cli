const { yellow, cyan } = require('colorette');
const logger = require('./logger');
const packageExists = require('./package-exists');
const promptInstallation = require('./prompt-installation');

const run = async (name, ...args) => {
    let packageLocation = packageExists(name);

    if (!packageLocation) {
        try {
            packageLocation = await promptInstallation(`${name}`, () => {
                logger.error(`The command moved into a separate package: ${yellow(name)}\n`);
            });
        } catch (err) {
            logger.error(`Action Interrupted, use ${cyan('webpack-cli help')} to see possible commands.`);
            process.exit(2);
        }
    }

    if (!packageLocation) {
        return;
    }

    let loaded = require(name);

    if (loaded.default) {
        loaded = loaded.default;
    }

    return loaded(...args);
};

module.exports = run;
