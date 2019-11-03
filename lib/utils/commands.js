const { commands } = require('./cli-flags');

const names = Object.keys(commands).map( i => {
    if (commands[i].alias) {
        return [commands[i].name, commands[i].alias];
    }
    return [commands[i].name];
}).reduce((arr, val) => arr.concat(val), []);

module.exports.names = names;
module.exports.info = commands;
