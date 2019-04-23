import * as path from "path";
import * as fs from "fs";

/**
 * Utility function to add a script in a package.json file given a key and a value
 *
 * @param {String} key - key of the script to be added in package.json
 * @param {String} value - command to be executed on running that script
 * @returns {void}
 */

export default function addScript(key: string, value: string): void {
  const localDir = process.cwd();
  // eslint-disable-next-line
  const packageJSON = require(path.resolve(localDir, "package.json"));
  if (!packageJSON["scripts"]) {
    packageJSON["scripts"] = {};
  }
  packageJSON["scripts"][key] = value;
  fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2), function(err): void {
		if (err) console.error(err);
  });
}
