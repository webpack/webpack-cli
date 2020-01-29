/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Parse cli args and split these to args for node js and the rest
 *
 * @param {string[]} rawArgs raw cli args
 * @returns {{cliArgs: string[], nodeArgs: string[]}} cli and nodejs args
 */
module.exports = rawArgs => {
    const cliArgs = [];
    const nodeArgs = [];
    let isNodeArg = false;

    for (const value of rawArgs) {
        if (value === '--node-args') {
            isNodeArg = true;
        } else if (isNodeArg) {
            isNodeArg = false;
            nodeArgs.push(...value.split(' '));
        } else {
            cliArgs.push(value);
        }
    }

    return { cliArgs, nodeArgs };
};
