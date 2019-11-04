const arguments = require('./cli-flags');

/**
 * @typedef {import("./command").Command} Command
 */

/**
 *
 * @type {Command[]}
 */
const info = arguments.commands;

const names = Object.keys(info)
    .map(i => {
        if (info[i].alias) {
            return [info[i].name, info[i].alias];
        }
        return [info[i].name];
    })
    .reduce((arr, val) => arr.concat(val), []);

exports.names = names;
exports.info = info;
