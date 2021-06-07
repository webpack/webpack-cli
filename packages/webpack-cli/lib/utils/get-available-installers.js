const { sync } = require("execa");

const utils = require("./");

function isPmInstalled(packageManager) {
    try {
        sync(packageManager, ["--version"]);
        return packageManager;
    } catch (err) {
        return false;
    }
}

function getAvailableInstallers() {
    const installers = ["npm", "yarn", "pnpm"];
    const availableInstallers = installers.filter((installer) => isPmInstalled(installer));

    if (!availableInstallers.length) {
        utils.logger.error("No package manager found.");
        process.exit(2);
    }
    return availableInstallers;
}

module.exports = getAvailableInstallers;
