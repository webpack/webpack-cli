import logger from 'webpack-cli/lib/utils/logger';

/**
 *
 * Get the devServer option from the user's compiler options
 *
 * @param {Object} compiler - webpack compiler
 * @param {Object} args - devServer args
 *
 * @returns {Object}
 */
export default function getDevServerOptions(compiler, args): any {
    const defaultOpts = {};
    const devServerOptions = [];
    const compilers = compiler.compilers || [compiler];
    if (args.name) {
        const comp = compilers.find((comp) => comp.name === args.name);

        if (comp && comp.options.devServer) {
            devServerOptions.push(comp.options.devServer);
        } else if (!comp) {
            // no compiler found
            logger.warn(`webpack config not found with name: ${comp.name}. Using default devServer config`);
        } else {
            // no devServer config found for compiler
            logger.warn('devServer config not found in specified webpack config. Using default devServer config');
        }
    } else {
        compilers.forEach((comp) => {
            if (comp.options.devServer) {
                devServerOptions.push(comp.options.devServer);
            }
        });
    }

    if (devServerOptions.length === 0) {
        devServerOptions.push(defaultOpts);
    }

    return devServerOptions;
}
