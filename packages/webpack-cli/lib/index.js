const WebpackCLI = require('./webpack-cli');
const { commands } = require('./utils/cli-flags');
const logger = require('./utils/logger');
const getPackageManager = require('./utils/get-package-manager');

module.exports = WebpackCLI;

// export additional utils used by other packages
module.exports.logger = logger;
module.exports.commands = commands;
module.exports.getPackageManager = getPackageManager;
