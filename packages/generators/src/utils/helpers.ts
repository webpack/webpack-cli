const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

/**
 * Convert str to kebab-case
 * @param str input string
 * @returns output string
 */
export function toKebabCase(str: string): string {
    return str.match(regex).join('-').toLowerCase();
}

/**
 * Convert str to UpperCamelCase
 * @param str import string
 * @returns {string} output string
 */
export function toUpperCamelCase(str: string): string {
    return str
        .match(regex)
        .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
        .join('');
}
