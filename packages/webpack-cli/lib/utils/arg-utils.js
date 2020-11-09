const { commands } = require('./cli-flags');

const hyphenToUpperCase = (name) => {
    if (!name) {
        return name;
    }
    return name.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
};

/**
 * Convert camelCase to kebab-case
 * @param {string} str input string in camelCase
 * @returns {string} output string in kebab-case
 */
const toKebabCase = (str) => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

const isCommandUsed = (args) =>
    commands.find((cmd) => {
        return args.includes(cmd.name) || args.includes(cmd.alias);
    });

module.exports = {
    toKebabCase,
    hyphenToUpperCase,
    isCommandUsed,
};
