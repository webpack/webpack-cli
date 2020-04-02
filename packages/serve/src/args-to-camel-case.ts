/**
 *
 * Converts dash-separated strings to camel case
 *
 * @param {String} str - the string to convert
 *
 * @returns {String} - new camel case string
 */
function dashesToCamelCase(str): string {
    return str.replace(/-([a-z0-9])/g, (g): string => g[1].toUpperCase());
}

/**
 *
 * Converts CLI args to camel case from dash-separated words
 *
 * @param {Object} args - argument object parsed by command-line-args
 *
 * @returns {Object} - the same args object as passed in, with new keys
 */
export default function argsToCamelCase(args): object {
    Object.keys(args).forEach((key): void => {
        const newKey = dashesToCamelCase(key);
        if (key !== newKey) {
            const arg = args[key];
            delete args[key];
            args[newKey] = arg;
        }
    });
    return args;
}
