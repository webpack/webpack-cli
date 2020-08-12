const { red, cyan, yellow } = require('colorette');

module.exports = {
    error: (val) => console.error(`[webpack-cli] ${red(val)}`),
    warn: (val) => console.warn(`[webpack-cli] ${yellow(val)}`),
    info: (val) => console.info(`[webpack-cli] ${cyan(val)}`),
    log: (val) => console.log(`[webpack-cli] ${val}`),
    help: (val) => console.log(val),
};
