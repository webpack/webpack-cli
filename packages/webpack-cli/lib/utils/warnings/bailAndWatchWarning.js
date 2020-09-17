const logger = require('../logger');

module.exports = (compiler) => {
    if (compiler.options.bail && compiler.options.watch) {
        logger.warn('You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.');
    }
};
