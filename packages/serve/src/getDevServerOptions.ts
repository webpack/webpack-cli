import { devServerOptionsType } from './types';

/**
 *
 * Get the devServer option from the user's compiler options
 *
 * @param {Object} compiler - webpack compiler
 * @param {Object} webpackArgs - webpack args
 *
 * @returns {Object}
 */
export default function getDevServerOptions(compiler): devServerOptionsType[] {
    const defaultOpts = {};
    const devServerOptions = [];
    const compilers = compiler.compilers || [compiler];

    compilers.forEach((comp) => {
        if (comp.options.devServer) {
            devServerOptions.push(comp.options.devServer);
        }
    });

    if (devServerOptions.length === 0) {
        devServerOptions.push(defaultOpts);
    }

    return devServerOptions;
}
