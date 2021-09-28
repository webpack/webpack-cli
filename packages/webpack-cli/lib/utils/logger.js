const utils = require("./index");
const util = require("util");

module.exports = {
  error: (val) => {
    const { red } = utils.colors.createColors({ useColor: utils.colors.isColorSupported });

    return console.error(`[webpack-cli] ${red(util.format(val))}`);
  },
  warn: (val) => {
    const { yellow } = utils.colors.createColors({ useColor: utils.colors.isColorSupported });

    return console.warn(`[webpack-cli] ${yellow(val)}`);
  },
  info: (val) => {
    const { cyan } = utils.colors.createColors({ useColor: utils.colors.isColorSupported });

    return console.info(`[webpack-cli] ${cyan(val)}`);
  },
  success: (val) => {
    const { green } = utils.colors.createColors({ useColor: utils.colors.isColorSupported });

    return console.log(`[webpack-cli] ${green(val)}`);
  },
  log: (val) => console.log(`[webpack-cli] ${val}`),
  raw: (val) => console.log(val),
};
