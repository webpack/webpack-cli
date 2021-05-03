import utils from './index';
import util from 'util';

const logger = {
    error: (val: string): void => console.error(`[webpack-cli] ${utils.colors.red(util.format(val))}`),
    warn: (val: string): void => console.warn(`[webpack-cli] ${utils.colors.yellow(val)}`),
    info: (val: string): void => console.info(`[webpack-cli] ${utils.colors.cyan(val)}`),
    success: (val: string): void => console.log(`[webpack-cli] ${utils.colors.green(val)}`),
    log: (val: string): void => console.log(`[webpack-cli] ${val}`),
    raw: (val: string): void => console.log(val),
};

export default logger
