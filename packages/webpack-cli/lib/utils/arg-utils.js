const { commands } = require('./cli-flags');

const isCommandUsed = (args) =>
    commands.find((cmd) => {
        return args.includes(cmd.name) || args.includes(cmd.alias);
    });

module.exports = {
    isCommandUsed,
};
