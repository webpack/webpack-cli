const { core } = require('./cli-flags');

const names = core
    .map(({ alias, name }) => {
        if (alias) {
            return [`--${name}`, `-${alias}`];
        }
        return [`--${name}`];
    })
    .reduce((arr, val) => arr.concat(val), []);

module.exports.names = names;
module.exports.info = core;
