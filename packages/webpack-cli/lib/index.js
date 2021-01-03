const CLI = require('./webpack-cli');
const logger = require('./utils/logger');
const getPackageManager = require('./utils/get-package-manager');

module.exports = CLI;
// export additional utils used by other packages
module.exports.utils = { logger, getPackageManager };
