const arguments = require('./cli-flags');

const info = arguments.commands;
const names = Object.keys(info).map( i => {
    if (info[i].alias) {
        return [info[i].name, info[i].alias];
    }
    return [info[i].name];
}).reduce((arr, val) => arr.concat(val), []);

module.exports.names = names;
module.exports.info = arguments.commands;
