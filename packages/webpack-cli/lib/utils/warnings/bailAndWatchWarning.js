const logger = require('../logger');

/**
 * warn the user if bail and watch both are used together
 * @param {Object} webpack compiler
 * @returns {void}
 */
const bailAndWatchWarning = (compiler) => {
    if (compiler.options.bail && compiler.options.watch) {
        logger.warn('You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.');
    }
};

module.exports = bailAndWatchWarning;
