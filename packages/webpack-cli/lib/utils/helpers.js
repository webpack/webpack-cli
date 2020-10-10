const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

/**
 * Convert str to kebab-case
 * @param str input string
 * @returns output string
 */
function toKebabCase(str) {
    return str.match(regex).join('-').toLowerCase();
}

module.exports = { toKebabCase };
