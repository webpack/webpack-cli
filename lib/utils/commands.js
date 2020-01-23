const { commands } = require('./cli-flags');

// Contains an array of strings with commands and their aliases that the cli supports
const names = commands
    .map(({ alias, name }) => {
        if (alias) {
            return [name, alias];
        }
        return [name];
    })
    .reduce((arr, val) => arr.concat(val), []);

module.exports = { names };
