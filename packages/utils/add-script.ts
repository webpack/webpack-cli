import * as path from "path";
import * as fs from "fs";

/**
 * Utility function to add a script in a package.json file given a key and a value
 *
 * @param {String} key - key of the script to be added in package.json
 * @param {String} value - command to be executed on running that script
 * @returns {void}
 */

const PACKAGE_JSON_FILE = "package.json";

export default function addScript(key: string, value: string): void {
  const localDir = process.cwd();
  const packageJSON = JSON.parse(fs.readFileSync(path.resolve(localDir, PACKAGE_JSON_FILE), "utf8"));
  if (!packageJSON.scripts) {
    packageJSON.scripts = {};
  }
  packageJSON.scripts[key] = value;
  fs.writeFile(PACKAGE_JSON_FILE, JSON.stringify(packageJSON, null, 2), function(err): void {
		if (err) console.error(err);
  });
}
