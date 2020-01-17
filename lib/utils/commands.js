const { commands } = require('./cli-flags');

// Contains a array of strings with commands and their alias that cli supports
const names = commands
    .map(({ alias, name }) => {
        if (alias) {
            return [name, alias];
        }
        return [name];
    })
    .reduce((arr, val) => arr.concat(val), []);

module.exports = { names };
