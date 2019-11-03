const { commands } = require('./cli-flags');

const names = Object.keys(commands).map( key => {
    if (commands[key].alias) {
        return [commands[key].name, commands[key].alias];
    }
    return [commands[key].name];
}).reduce((arr, val) => arr.concat(val), []);

module.exports.names = names;
module.exports.info = commands;
