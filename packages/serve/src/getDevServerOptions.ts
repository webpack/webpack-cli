/**
 *
 * Get the devServer option from the user's compiler options
 *
 * @param {Object} compiler - webpack compiler
 *
 * @returns {Object}
 */
export default function getDevServerOptions(compiler): any {
    let devServerOptions;
    if (compiler.compilers) {
        // devServer options could be found in any of the compilers,
        // so simply find the first instance and use it, if there is one
        const comp = compiler.compilers.find((comp) => comp.options.devServer);
        if (comp) {
            devServerOptions = comp.options.devServer;
        }
    } else {
        devServerOptions = compiler.options.devServer;
    }
    devServerOptions = devServerOptions || {};

    return devServerOptions;
}
