const fs = require("node:fs");
const { join } = require("node:path");
const collectTestFolders = require("./utils");

const outputDirectories = [
  "bin",
  "binary",
  "dist",
  "test",
  "test-assets",
  "test-plugin",
  "test-loader",
  "test-cache-path",
  "test-locate-cache",
  "stats.json",
];

const folderStrategy = (stats, file) => stats.isDirectory() && outputDirectories.includes(file);

const cleanupOutputDirs = () => {
  for (const outputFolder of collectTestFolders(folderStrategy)) {
    for (const dir of outputDirectories) {
      fs.rmSync(join(outputFolder, dir), { recursive: true, force: true });
    }
  }
};

module.exports = cleanupOutputDirs;
