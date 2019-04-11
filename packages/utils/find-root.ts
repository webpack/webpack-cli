import * as findup from "findup-sync";
import * as path from "path";

/**
 * Returns the absolute path of the project directory
 * Finds the package.json, by using findup-sync
 * @returns {String} path of project directory
 */

export function findProjectRoot(): string {
  const rootFilePath = findup(`package.json`);
  const projectRoot = path.dirname(rootFilePath);
  return projectRoot;
}
