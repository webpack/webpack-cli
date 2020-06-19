import findup from 'findup-sync';
import fs from 'fs';
import path from 'path';

/**
 * Attempts to detect whether the string is a local path regardless of its
 * existence by checking its format. The point is to distinguish between
 * paths and modules on the npm registry. This will fail for non-existent
 * local Windows paths that begin with a drive letter, e.g. C:..\generator.js,
 * but will succeed for any existing files and any absolute paths.
 *
 * @param {String} str - string to check
 * @returns {Boolean} whether the string could be a path to a local file or directory
 */

export function isLocalPath(str: string): boolean {
    return path.isAbsolute(str) || /^\./.test(str) || fs.existsSync(str);
}

/**
 * Find the root directory path of a project.
 * @param {String} cwd - Any custom starting point to walk through directories
 * @returns {String} Absolute path of the project root.
 */

export function findProjectRoot(cwd = process.cwd()): string {
    const rootFilePath = findup('package.json', { cwd });
    const projectRoot = path.dirname(rootFilePath);
    return projectRoot;
}
