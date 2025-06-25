const fs = require("node:fs");
const path = require("node:path");

const BASE_DIR = "test/";

/**
 * @param {string} folderToRead folder to read
 * @param {string[]} folders folders
 * @param {((stats: import("node:fs").Stats, file: string) => boolean)=} folderStrategy filter function
 * @returns {string[]} folders
 */
function extractFolder(folderToRead, folders = [], folderStrategy = undefined) {
  let files;

  try {
    files = fs.readdirSync(folderToRead);
  } catch {
    return [];
  }

  if (!files) {
    return [];
  }

  for (const file of files) {
    const filePath = path.resolve(path.join(folderToRead, file));
    const stats = fs.statSync(filePath);

    if (folderStrategy && folderStrategy(stats, file)) {
      folders.push(folderToRead);
    }

    if (stats.isDirectory() && file !== "node_modules") {
      extractFolder(filePath, folders, folderStrategy);
    }
  }

  return folders;
}

/**
 * @param {string} strategy strategy
 * @returns {string[]} folders
 */
function collectTestFolders(strategy) {
  const testFolder = path.resolve(path.join(process.cwd(), BASE_DIR));

  return extractFolder(testFolder, [], strategy);
}

module.exports = collectTestFolders;
