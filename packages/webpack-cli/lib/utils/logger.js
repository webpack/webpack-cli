const util = require('util');
const { red, cyan, yellow, green } = require('colorette');

module.exports = {
    error: (val) => console.error(`[webpack-cli] ${red(util.format(val))}`),
    warn: (val, needColors) => console.warn(`[webpack-cli] ${needColors ? yellow(val) : val}`),
    info: (val) => console.info(`[webpack-cli] ${cyan(val)}`),
    success: (val) => console.log(`[webpack-cli] ${green(val)}`),
    log: (val) => console.log(`[webpack-cli] ${val}`),
    raw: (val) => console.log(val),
};
