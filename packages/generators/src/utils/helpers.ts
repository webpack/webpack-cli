/**
 * Convert str to KebabCase from CamelCase
 * @param str input string
 * @returns output string
 */
export function toKebabCase(str: string): string {
    const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
    return str.match(regex).join('-').toLowerCase();
}
