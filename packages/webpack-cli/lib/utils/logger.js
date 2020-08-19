const { red, cyan, yellow, green } = require('colorette');

module.exports = {
    error: (val) => console.error(`[webpack-cli] ${red(val)}`),
    warn: (val) => console.warn(`[webpack-cli] ${yellow(val)}`),
    info: (val) => console.info(`[webpack-cli] ${cyan(val)}`),
    success: (val) => console.log(`[webpack-cli] ${green(val)}`),
    log: (val) => console.log(`[webpack-cli] ${val}`),
    rawLog: (val) => console.log(val),
};
