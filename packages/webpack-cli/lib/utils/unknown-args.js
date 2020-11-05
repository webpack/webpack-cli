const { commands, core } = require('./cli-flags');

// Contains an array of strings with commands and their aliases that the cli supports
const commandNames = commands
    .map(({ alias, name }) => {
        if (alias) {
            return [name, alias];
        }
        return [name];
    })
    .reduce((arr, val) => arr.concat(val), []);

// Contains an array of strings with core cli flags and their aliases
const flagNames = core
    .map(({ alias, name }) => {
        if (name === 'help') return [];
        if (alias) {
            return [`--${name}`, `-${alias}`];
        }
        return [`--${name}`];
    })
    .reduce((arr, val) => arr.concat(val), []);

module.exports = {
    commands: [...commandNames],
    allNames: [...commandNames, ...flagNames],
    hasUnknownArgs: (args, names) =>
        args.filter((e) => !names.includes(e) && !e.includes('color') && e !== 'version' && e !== '-v' && !e.includes('help')),
};
