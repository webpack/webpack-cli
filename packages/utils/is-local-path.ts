import * as fs from "fs";
import * as path from "path";

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

export default function(str: string): boolean {
	return path.isAbsolute(str) || /^\./.test(str) || fs.existsSync(str);
}
