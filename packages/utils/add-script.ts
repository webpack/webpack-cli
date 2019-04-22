import { json } from "mrm-core";
import * as path from "path";

/**
 * Utility function to add a script to a package.json file given a key and a value
 *
 * @param {String} key - key of the script to be added in package.json
 * @param {String} value - command to be executed on running that script
 * @returns {Boolean} whether the string could be a path to a local file or directory
 */

export default function addScript(key: string, value: string): void {
  const localDir = process.cwd();
  // Create webpack in package.json if it doesn’t exist 
  const pkg = json(path.resolve(localDir, "package.json"));
  const scriptPath = ["scripts", key];
  if (!pkg.get(scriptPath)) {
    pkg.set(scriptPath, value).save();
  }
}
