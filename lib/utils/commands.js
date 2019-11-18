const { commands } = require('./cli-flags');

const names = commands
    .map(({ alias, name }) => {
        if (alias) {
            return [name, alias];
        }
        return [name];
    })
    .reduce((arr, val) => arr.concat(val), []);

module.exports.commands = commands;
module.exports.names = names;
